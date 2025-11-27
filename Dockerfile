FROM node:lts AS build-stage

WORKDIR /nuxtapp

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx nuxi prepare

RUN npm run build

FROM node:lts AS prod-stage

WORKDIR /nuxtapp

COPY --from=build-stage /nuxtapp/.output ./.output
COPY --from=build-stage /nuxtapp/package.json ./package.json

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
