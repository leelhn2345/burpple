FROM oven/bun:1 AS base

WORKDIR /app

FROM base AS builder

COPY bun.lockb .
COPY package.json .
RUN bun i --frozen-lockfile

COPY . .
RUN bun run build


FROM base AS release

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENTRYPOINT ["bun","start"]


