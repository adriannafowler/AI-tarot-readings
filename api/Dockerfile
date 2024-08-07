# Use the official Python image as the base image
FROM python:3.10-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies
WORKDIR /app

# Install PostgreSQL client libraries
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Copy the database dump file
COPY /db_dump.sql /app/db_dump.sql

#Collect static files (if you have any)
RUN python /app/manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "tarot_project.wsgi:application"]
