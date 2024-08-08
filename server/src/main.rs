use std::{fs, path::Path};

use server::start_server;
use settings::{get_connection_pool, get_environment, get_settings, Environment};
use tracing::level_filters::LevelFilter;
use tracing_subscriber::{filter::Targets, fmt, layer::SubscriberExt, util::SubscriberInitExt};

mod server;
mod settings;

#[tokio::main]
async fn main() {
    let env = get_environment();
    let config = get_settings(&env).expect("failed to parse config");
    let pool = get_connection_pool(&env, &config.database).await;

    init_tracing(&env, vec!["burpple_backend"]);

    // create_asset_directory();

    start_server(config, pool).await;
}

/// * `env`: `local` or `production`
/// * `targets`: vector of crates whose trace we are interested in.
fn init_tracing(env: &Environment, targets: Vec<&str>) {
    let env_level = match *env {
        Environment::Local => LevelFilter::DEBUG,
        Environment::Production => LevelFilter::INFO,
    };

    let targets_with_level: Vec<(&str, LevelFilter)> =
        targets.into_iter().map(|s| (s, env_level)).collect();

    let target_filter = Targets::new().with_targets(targets_with_level);

    let format_layer = fmt::layer()
        .without_time()
        .with_file(true)
        .with_line_number(true)
        .with_target(false);

    tracing_subscriber::registry()
        .with(format_layer)
        .with(target_filter)
        .init();

    // tracing::subscriber::set_global_default(subscriber).expect("failed to set tracing subscriber");
}

/// create directory to store images
#[allow(dead_code)]
fn create_asset_directory() {
    let path = Path::new("./assets");

    if !path.exists() {
        fs::create_dir(path).expect("failed to create directory");
    }
}
