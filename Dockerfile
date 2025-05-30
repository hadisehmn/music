FROM node:23-alpine

COPY . .

RUN npm install

CMD node bootstrap.js