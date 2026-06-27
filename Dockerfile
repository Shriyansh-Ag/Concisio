FROM python:3.10-slim

WORKDIR /app

# Ensure src.concisio imports resolve correctly
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download nltk data needed by ROUGE evaluation
RUN python -c "import nltk; nltk.download('punkt_tab', download_dir='/usr/local/nltk_data')"

# Copy source code
COPY . .

# HF Spaces runs on port 7860
EXPOSE 7860

# Run the FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
