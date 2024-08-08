use axum::{
    body::Body,
    http::{header::CONTENT_TYPE, Request, Response, StatusCode},
    routing::{delete, get},
    Router,
};
use restaurants::{del_restaurant, get_restaurants, insert_restaurant, update_restaurant};
use secrecy::ExposeSecret;
use sqlx::PgPool;
use tower::ServiceBuilder;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::Span;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use utoipauto::utoipauto;

use crate::settings::Settings;

mod restaurants;

pub async fn start_server(settings: Settings, pool: PgPool) {
    let address = format!(
        "{}:{}",
        settings.application.host, settings.application.web_port
    );

    tracing::debug!(
        "starting app @ http://localhost:{}",
        settings.application.web_port
    );

    let listener = tokio::net::TcpListener::bind(address)
        .await
        .expect("can't bind address to tcp listener");

    let app_router = app_router(&settings, pool);

    axum::serve(listener, app_router.into_make_service())
        .await
        .expect("error starting axum app");
}

#[derive(Clone)]
pub struct AppState {
    pool: PgPool,
}

impl AppState {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[utoipauto(paths = "./src")]
#[derive(OpenApi)]
#[openapi()]
struct ApiDoc;

fn app_router(settings: &Settings, pool: PgPool) -> Router {
    let cors_layer = CorsLayer::new()
        .allow_origin([settings
            .application
            .request_origin
            .expose_secret()
            .parse()
            .unwrap()])
        .allow_headers([CONTENT_TYPE])
        .allow_credentials(true);

    let trace_layer = TraceLayer::new_for_http()
        .make_span_with(|request: &Request<Body>| {
            let request_id = uuid::Uuid::new_v4();
            tracing::info_span!(
                "request",
                method = tracing::field::display(request.method()),
                uri = tracing::field::display(request.uri()),
                version = tracing::field::debug(request.version()),
                request_id = tracing::field::display(request_id),
                latency = tracing::field::Empty,
                status_code = tracing::field::Empty,
            )
        })
        .on_response(
            |response: &Response<Body>, latency: std::time::Duration, span: &Span| {
                span.record("status_code", tracing::field::display(response.status()));
                span.record("latency", tracing::field::debug(latency));
                // add tracing below here
                // useful if using bunyan trace format
            },
        );

    let layers = ServiceBuilder::new()
        .layer(trace_layer)
        // .layer(auth_layer)
        .layer(cors_layer);

    let app_state = AppState::new(pool);

    Router::new()
        .merge(SwaggerUi::new("/docs").url("/docs.json", ApiDoc::openapi()))
        .route("/restaurants", get(get_restaurants).post(insert_restaurant))
        .route(
            "/restaurants/:res_id",
            delete(del_restaurant).put(update_restaurant),
        )
        .with_state(app_state)
        .layer(layers)
        .route("/", get("hello world"))
        .route("/health_check", get(StatusCode::OK))
        .fallback(|| async { (StatusCode::NOT_FOUND, "invalid api") })
}
