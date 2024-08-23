# Stage 1: base image
FROM node:20-alpine AS base


# Stage 2: install production dependencies (pnpm install --prod)
FROM base AS runtime-deps

ARG NPM_TOKEN

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Stage 3: the final runner image (using build + runtime-deps)
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=runtime-deps /app/node_modules ./node_modules
COPY --from=build /app/server/ ./server
COPY package*.json ./

EXPOSE 80
CMD ["node", "server/index.js"]

