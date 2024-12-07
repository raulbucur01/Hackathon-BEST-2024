# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files to the container
COPY . .

# Expose the port Cloud Run uses
ENV PORT 8080
EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "openai_symptoms_api:app", "--host", "0.0.0.0", "--port", "8080"]
