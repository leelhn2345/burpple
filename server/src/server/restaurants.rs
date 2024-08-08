use std::time::Instant;

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use utoipa::{IntoParams, ToSchema};

use super::AppState;

#[derive(thiserror::Error, Debug)]
pub enum RestaurantError {
    #[error(transparent)]
    Database(#[from] sqlx::Error),
}

impl IntoResponse for RestaurantError {
    fn into_response(self) -> axum::response::Response {
        #[derive(Serialize)]
        struct ErrorResponse {
            message: String,
        }

        let (status_code, msg) = match self {
            Self::Database(e) => {
                tracing::error!("{e:#?}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "internal server error".to_owned(),
                )
            }
        };

        (status_code, Json(ErrorResponse { message: msg })).into_response()
    }
}

#[derive(sqlx::FromRow, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Restaurant {
    id: Option<i32>,
    name: String,
    address: String,
    cuisine: String,
    description: String,
    #[serde(with = "time::serde::rfc3339")]
    created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    updated_at: OffsetDateTime,
}

impl Restaurant {
    pub fn new(name: String, address: String, cuisine: String, description: String) -> Self {
        let now = OffsetDateTime::now_utc();
        Self {
            id: None,
            name,
            address,
            cuisine,
            description,
            created_at: now,
            updated_at: now,
        }
    }
}

#[derive(ToSchema, Serialize)]
pub struct RestaurantData {
    total: i64,
    offset: i64,
    limit: i64,
    elapsed: String,
    data: Vec<Restaurant>,
}

#[derive(Deserialize, IntoParams)]
pub struct GetRestuarantQuery {
    search: Option<String>,
    /// use with `sort`
    column: Option<String>,
    /// use with `column`. either `asc` or `desc`
    sort: Option<String>,
    #[serde(default = "default_rows")]
    #[param(default = 10)]
    limit: i64,
    #[serde(default = "default_page_idx")]
    #[param(default = 0)]
    offset: i64,
}

fn default_rows() -> i64 {
    10
}

fn default_page_idx() -> i64 {
    0
}

#[utoipa::path(
    get,
    tag = "restaurant",
    path = "/restaurants",
    params(GetRestuarantQuery),
    responses(
        (status = 200, body = RestaurantData, description = "list of available restaurants"))
)]
#[tracing::instrument(skip_all)]
/// get all restaurant details
pub async fn get_restaurants(
    State(app): State<AppState>,
    Query(query_params): Query<GetRestuarantQuery>,
) -> Result<Json<RestaurantData>, RestaurantError> {
    let now = Instant::now();
    let pool = app.pool;

    let offset = (query_params.offset) * query_params.limit;

    let sort = match query_params.sort {
        Some(x) => match x.trim().to_lowercase().as_ref() {
            "asc" => Some("asc".to_string()),
            "desc" => Some("desc".to_string()),
            _ => None,
        },
        None => None,
    };

    let (total, restaurants) = match (query_params.search, query_params.column, sort) {
        (Some(x), Some(y), Some(z)) => {
            let text_search = x.replace(' ', "+") + ":*";

            let total = sqlx::query!(
                "select count(*) from restaurants
                where vector @@ to_tsquery($1)
                ",
                text_search
            )
            .fetch_one(&pool)
            .await
            .map(|rec| rec.count.unwrap_or(0))?;

            let query = format!(
                "select id,name,address,cuisine,description,created_at,updated_at
                from restaurants
                where vector @@ to_tsquery('{text_search}')
                order by {y} {z}
                limit $1 offset $2"
            );

            let data = sqlx::query_as(&query)
                .bind(query_params.limit)
                .bind(offset)
                .fetch_all(&pool)
                .await?;
            (total, data)
        }
        (None, Some(y), Some(z)) => {
            let total = sqlx::query!("select count(*) from restaurants")
                .fetch_one(&pool)
                .await
                .map(|rec| rec.count.unwrap_or(0))?;

            let query = format!(
                "select id,name,address,cuisine,description,created_at,updated_at
                from restaurants
                order by {y} {z}
                limit $1 offset $2"
            );

            let data = sqlx::query_as(&query)
                .bind(query_params.limit)
                .bind(offset)
                .fetch_all(&pool)
                .await?;
            (total, data)
        }
        (Some(x), None, None) => {
            let text_search = x.replace(' ', "+") + ":*";

            let total = sqlx::query!(
                "select count(*) from restaurants
                where vector @@ to_tsquery($1)
                ",
                text_search
            )
            .fetch_one(&pool)
            .await
            .map(|rec| rec.count.unwrap_or(0))?;
            let data = sqlx::query_as!(
                Restaurant,
                "select id,name,address,cuisine,description,created_at,updated_at
                from restaurants
                where vector @@ to_tsquery($1)
                limit $2 offset $3",
                text_search,
                query_params.limit,
                offset
            )
            .fetch_all(&pool)
            .await?;
            (total, data)
        }
        (_, _, _) => {
            let total = sqlx::query!("select count(*) from restaurants")
                .fetch_one(&pool)
                .await
                .map(|rec| rec.count.unwrap_or(0))?;

            let data = sqlx::query_as!(
                Restaurant,
                r#"
        select id, name, address, cuisine, description, created_at, updated_at
        from restaurants
        order by id desc
        limit $1 offset $2
        "#,
                &query_params.limit,
                offset
            )
            .fetch_all(&pool)
            .await?;
            (total, data)
        }
    };

    let elapsed = now.elapsed().as_secs_f32().to_string() + "s";
    Ok(Json(RestaurantData {
        elapsed,
        offset: query_params.offset,
        limit: query_params.limit,
        total,
        data: restaurants,
    }))
}

#[utoipa::path(
    delete,
    tag="restaurant",
    path="/restaurants/{res_id}",
    params(
        ("res_id",description="restaurant id")
    ),
    responses(
        (status = 204, description="details deleted")
    )
)]
/// delete restaurant
pub async fn del_restaurant(
    State(app): State<AppState>,
    Path(res_id): Path<i32>,
) -> Result<StatusCode, RestaurantError> {
    let pool = app.pool;
    sqlx::query!("delete from restaurants where id = $1", res_id)
        .execute(&pool)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(ToSchema, Deserialize)]
pub struct RestaurantDetails {
    name: String,
    address: String,
    cuisine: String,
    description: String,
}

#[utoipa::path(
    put,
    tag="restaurant",
    path="/restaurants/{res_id}",
    params(
        ("res_id",description="restaurant id")
    ),
    request_body(content=RestaurantDetails,description="essential restaurant details"),
    responses(
        (status = 201, description="new details saved")
    )
)]
/// update restaurant details
pub async fn update_restaurant(
    State(app): State<AppState>,
    Path(res_id): Path<i32>,
    Json(res): Json<RestaurantDetails>,
) -> Result<StatusCode, RestaurantError> {
    let pool = app.pool;
    sqlx::query!(
        "update restaurants
        set
        name = $1,
        address = $2,
        cuisine = $3,
        description = $4,
        updated_at = $5
        where id = $6",
        res.name,
        res.address,
        res.cuisine,
        res.description,
        OffsetDateTime::now_utc(),
        res_id
    )
    .execute(&pool)
    .await?;

    Ok(StatusCode::OK)
}

#[utoipa::path(
    post,
    tag="restaurant",
    path="/restaurants",
    request_body(content=RestaurantDetails,description="essential restaurant details"),
    responses(
        (status = 201, description="new restaurant details saved")
    )
)]
/// post new restaurant details
pub async fn insert_restaurant(
    State(app): State<AppState>,
    Json(res): Json<RestaurantDetails>,
) -> Result<StatusCode, RestaurantError> {
    let pool = app.pool;
    let now = OffsetDateTime::now_utc();
    sqlx::query!(
        "insert into restaurants (name,address,cuisine,description,created_at,updated_at)
    values($1,$2,$3,$4,$5,$6)",
        res.name,
        res.address,
        res.cuisine,
        res.description,
        now,
        now
    )
    .execute(&pool)
    .await?;
    Ok(StatusCode::CREATED)
}
