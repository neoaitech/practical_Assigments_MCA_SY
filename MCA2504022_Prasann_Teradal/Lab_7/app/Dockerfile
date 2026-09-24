# Base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /usr/src/app

# Copy dependency file first (layer caching optimization)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Document the port the app listens on
EXPOSE 5000

# Command to run when container starts
CMD ["python", "app.py"]
