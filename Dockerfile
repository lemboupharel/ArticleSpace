# Use stable Node with glibc compatible with Fly
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies, force sqlite3 to build from source
RUN npm install --build-from-source

# Copy the rest of the app
COPY . .

# Expose the internal port Fly expects
EXPOSE 8080

# Start your app
CMD ["node", "src/index.js"]
