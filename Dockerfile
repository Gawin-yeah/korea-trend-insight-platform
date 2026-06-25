FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY next.config.ts next.config.ts
COPY postcss.config.mjs postcss.config.mjs
COPY next-env.d.ts next-env.d.ts
COPY app app
COPY src src
COPY db db
COPY scripts scripts
COPY docs docs
COPY public public
COPY .openai .openai
COPY .env.example .env.example

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]

