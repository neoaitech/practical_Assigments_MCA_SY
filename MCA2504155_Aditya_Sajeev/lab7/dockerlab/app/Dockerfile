FROM python:3.11-slim

WORKDIR /usr/src/app

COPY requirement.txt .

RUN pip install --no-cache-dir -r requirement.txt

COPY . .

EXPOSE 5000

CMD ["python","app.py"]