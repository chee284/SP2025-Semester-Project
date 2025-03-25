FROM docker.io/node:latest

WORKDIR /app

RUN npm install

COPY  .  .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]

# docker build -t ski-slopes-frontend -f docker/frontend/Dockerfile ./ski_slopes 