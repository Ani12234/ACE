# ACE Server Dockerfile - Backend API Server
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN npm install && npm cache clean --force

# Copy source code (this layer will rebuild only when source changes)
# .dockerignore file excludes node_modules and other unnecessary files
COPY . .

# Ensure node_modules is not copied (extra safety)
RUN rm -rf node_modules 2>/dev/null || true

# Expose port for API server
EXPOSE 4000

# Start API server
CMD ["npm", "run", "dev"]
