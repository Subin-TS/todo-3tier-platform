from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.todos import router as todos_router

app = FastAPI(
    title="Todo API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/ready")
def ready():
    return {"status": "ready"}


app.include_router(todos_router, prefix="/api")
