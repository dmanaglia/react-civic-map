import os
# from dotenv import load_dotenv

# load_dotenv()

class Settings:
    PROJECT_NAME: str = "My FastAPI App"
    BACKEND_CORS_ORIGINS = ["http://localhost:3000"]

settings = Settings()