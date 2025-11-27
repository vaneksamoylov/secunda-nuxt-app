FROM node:lts as build-stage

WORKDIR /nuxtapp

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts as prod-stage

WORKDIR /nuxtapp

COPY --from=build-stage /nuxtapp/.output ./.output
COPY --from=build-stage /nuxtapp/package.json ./package.json

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]