FROM docker.io/node:latest

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json* ./

RUN npm install

# Then copy the rest of the code
COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]

# docker build -t ski-slopes-frontend -f docker/frontend/Dockerfile ./ski_slopes 