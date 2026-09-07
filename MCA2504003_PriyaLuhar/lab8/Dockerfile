# Base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /usr/src/app

# Copy dependency file first
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose application port
EXPOSE 5000

# Start the application
CMD ["python", "app.py"]