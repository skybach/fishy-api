# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /
COPY . .
RUN npm install
CMD ["node", "index.js"]
EXPOSE 8080