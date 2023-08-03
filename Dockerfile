FROM node:lts-bullseye AS build
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:lts-bullseye-slim AS run

ENV NODE_ENV=production

RUN apt-get update \
	&& apt-get install -y openssl \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/apt/*

WORKDIR /app

RUN npm install -g pnpm
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/build ./build

EXPOSE 3000

CMD "node" "./build"
