from fastapi import FastAPI

from app.api.todos import router as todos_router

app = FastAPI(
    title="Todo API",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/ready")
def ready():
    return {"status": "ready"}


app.include_router(todos_router)
