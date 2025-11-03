from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.routes import geojson

app = FastAPI(title="My FastAPI Backend")

# CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(geojson.router, prefix="/geojson", tags=["geojson"])

# Health
@app.get("/api/health")
def health_check():
    return {"status": "ok"}