from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import geojson, official

app = FastAPI(title="My FastAPI Backend")

# CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(geojson.router, prefix="/geojson", tags=["geojson"])
app.include_router(official.router, prefix="/official", tags=["official"])


# Health
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
