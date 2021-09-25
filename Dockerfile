# syntax=docker/dockerfile:1

FROM node:14.17.4
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["node",  "src/index.js" ]