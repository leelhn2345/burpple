use database::DatabaseSettings;
use figment::{
    providers::{Env, Format, Yaml},
    Figment,
};
use secrecy::SecretString;
use serde::Deserialize;

mod database;
mod environment;

pub use database::*;
pub use environment::*;

#[derive(Debug, Deserialize, Clone)]
pub struct AppSettings {
    pub web_port: u16,
    pub host: String,
    pub request_origin: SecretString,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Settings {
    pub application: AppSettings,
    pub database: DatabaseSettings,
}

pub fn get_settings(env: &Environment) -> Result<Settings, figment::Error> {
    let base_path = std::env::current_dir().expect("failed to determine current working directory");
    let config_dir = base_path.join("settings");

    let env_filename = format!("{}.yaml", env.as_str());

    Figment::new()
        .merge(Yaml::file(config_dir.join("base.yaml")))
        .merge(Yaml::file(config_dir.join(env_filename)))
        .merge(Env::prefixed("APP_").split("__"))
        .extract()
}
