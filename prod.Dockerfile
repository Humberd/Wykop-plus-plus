FROM node:10.15.0

WORKDIR /app

COPY . .

RUN npm ci