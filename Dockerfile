FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
RUN npm install -g nodemon
RUN apt-get update && apt-get install -y sqlite3

COPY . .

EXPOSE 3000

CMD ["nodemon", "./src/infra/api/server.ts"]