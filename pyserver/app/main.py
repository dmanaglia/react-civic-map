from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.routes import users

app = FastAPI(title="My FastAPI Backend")

# CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
# app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}