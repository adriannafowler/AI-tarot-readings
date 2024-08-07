# Use an official node runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm i -g serve

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that Vite uses
EXPOSE 3000

# Command to run the application
CMD [ "serve", "-s", "dist" ]
