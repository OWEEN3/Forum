FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY .env.docker .env

ENV PYTHONPATH=/app

CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload