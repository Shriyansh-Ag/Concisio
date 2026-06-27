from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from starlette.responses import RedirectResponse
from fastapi.responses import Response
from pydantic import BaseModel
from src.concisio.pipeline.predicition_pipeline import PredictionPipeline


class SummarizeRequest(BaseModel):
    text: str


app = FastAPI(
    title="Concisio",
    description="Concisio — AI-powered text summarization API powered by Google PEGASUS fine-tuned on the SAMSum dataset.",
    version="1.0.0",
)

# CORS — allow the Next.js frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["authentication"])
async def index():
    return RedirectResponse(url="/docs")


@app.get("/train")
async def training():
    try:
        os.system("python main.py")
        return Response("Training successful !!")

    except Exception as e:
        return Response(f"Error Occurred! {e}")


# --- Original endpoint (kept for backward compatibility) ---
@app.post("/predict")
async def predict_route(text: str):
    try:
        obj = PredictionPipeline()
        text = obj.predict(text)
        return text
    except Exception as e:
        raise e


# --- New clean endpoints for the Next.js frontend ---
@app.post("/api/summarize")
async def summarize(request: SummarizeRequest):
    """Accept JSON { "text": "..." } and return { "summary": "..." }"""
    try:
        obj = PredictionPipeline()
        summary = obj.predict(request.text)
        return {"summary": summary}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Accept a text file upload, read its content, and return a summary."""
    try:
        contents = await file.read()
        text_content = contents.decode("utf-8")
        obj = PredictionPipeline()
        summary = obj.predict(text_content)
        return {"summary": summary, "original_length": len(text_content)}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
