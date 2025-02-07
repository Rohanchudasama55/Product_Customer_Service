FROM node:19-alpine

COPY package.json /app/
COPY . /app/

WORKDIR /app

RUN npm install

EXPOSE 8081 8082 8083

CMD ["npm", "run", "start:all"]
