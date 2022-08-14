FROM node:16.5.0

WORKDIR /client/app

COPY package.json .

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "start"]