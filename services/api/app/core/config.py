from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[4]
ROOT_ENV = REPO_ROOT / ".env"
print(f"[config] .env = {ROOT_ENV} (exists={ROOT_ENV.exists()})")

class Settings(BaseSettings):
    database_url: str
    redis_url: str

    s3_endpoint: str
    s3_bucket: str
    s3_access_key: str
    s3_secret_key: str
    jwt_secret: str
    aws_region: str = "us-east-1"

    model_config = SettingsConfigDict(
        env_file=[ROOT_ENV, ".env"],
        extra="ignore",
    )

settings = Settings()
