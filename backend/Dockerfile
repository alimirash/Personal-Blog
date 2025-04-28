FROM python:3.9-slim

# Install required system packages
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create required directories
RUN mkdir -p staticfiles media
RUN mkdir -p api/management/commands
RUN touch api/management/__init__.py
RUN touch api/management/commands/__init__.py

# Make the entrypoint script executable
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Run the entrypoint script
CMD ["/app/entrypoint.sh"]
