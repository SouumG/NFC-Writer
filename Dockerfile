# Step 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies like Vite and TypeScript)
RUN npm ci

# Copy application source code
COPY . .

# Compile production-ready static assets
RUN npm run build

# Step 2: Runtime Stage
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install only production dependencies (like express)
RUN npm ci --only=production

# Copy compiled static assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the production server script
COPY --from=builder /app/server.js ./server.js

# Expose port 3000
EXPOSE 3000

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=3000

# Start the production server
CMD ["node", "server.js"]
