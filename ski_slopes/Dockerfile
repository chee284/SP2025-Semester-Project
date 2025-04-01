FROM docker.io/node:latest

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json* ./

RUN npm install

# Then copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 5173

# Start the app in development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# docker build -t ski-slopes-frontend -f docker/frontend/Dockerfile ./ski_slopes 