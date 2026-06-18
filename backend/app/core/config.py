import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrustNet AI"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = Field(default="SUPER_SECRET_SECURITY_PASSPHRASE_KEY_89104", validation_alias="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520 # 8 days
    
    # Databases
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/trustnet",
        validation_alias="DATABASE_URL"
    )
    
    NEO4J_URI: str = Field(default="bolt://localhost:7687", validation_alias="NEO4J_URI")
    NEO4J_USER: str = Field(default="neo4j", validation_alias="NEO4J_USER")
    NEO4J_PASSWORD: str = Field(default="password", validation_alias="NEO4J_PASSWORD")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
