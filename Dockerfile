FROM node:18-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build


FROM node:18-alpine as production

WORKDIR /app

COPY --from=development /app/package.json .
COPY --from=development /app/package-lock.json .
COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma/migrations ./prisma/migrations
COPY --from=development /app/prisma/schema.prisma ./prisma/schema.prisma

RUN npm install

EXPOSE 3000

CMD ["npm","run","start"]
