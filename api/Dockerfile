# cd api
# pip install -r requirements.txt
# uvicorn main:app --reload --host 0.0.0.0 --port 8000

FROM python:3.12-slim

WORKDIR /api

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]