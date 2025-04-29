#!/bin/bash

# Wait for postgres to be ready
echo "Waiting for postgres..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Run Django migrations
python manage.py makemigrations api
python manage.py migrate

# Load initial game data
python manage.py load_games

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn --bind 0.0.0.0:8000 blog.wsgi:application
