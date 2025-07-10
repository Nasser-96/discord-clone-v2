FROM node:24.4.0-alpine3.22

WORKDIR /app

COPY package*.json . 
RUN npm install

COPY . .

EXPOSE 9000

CMD [ "npm", "run", "start:dev" ]