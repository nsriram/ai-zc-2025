# Use Node.js 20 Alpine as base image for smaller size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for root, backend, and frontend
RUN npm install && \
    cd backend && npm install && \
    cd ../frontend && npm install && \
    cd /app

# Copy all application files
COPY . .

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Verify build output
RUN ls -la /app/frontend/dist || (echo "Frontend build failed - dist directory not created" && exit 1)

# Switch back to app directory
WORKDIR /app

# Expose port 3000 (backend port)
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the backend server (which will serve the frontend static files)
CMD ["node", "backend/server.js"]