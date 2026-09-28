from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Todo API"
    app_version: str = "1.0.0"

    db_host: str
    db_port: int = 3306
    db_name: str
    db_user: str
    db_password: str

    class Config:
        env_file = ".env"
        extra = "ignore"

def get_settings() -> Settings:
    return Settings()
