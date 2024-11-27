FROM node:20

USER node

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["node", "index.js"]
