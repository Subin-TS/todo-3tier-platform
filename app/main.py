from fastapi import FastAPI

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
