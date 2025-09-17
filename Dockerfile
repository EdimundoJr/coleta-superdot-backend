FROM node:20-alpine

RUN mkdir /home/app
WORKDIR /home/app

# -- BUILDING
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

COPY ./src/storage/emailTemplates ./build/storage/emailTemplates