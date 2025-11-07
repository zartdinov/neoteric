FROM oven/bun:1.3.1-alpine

WORKDIR /app

COPY index.ts .

CMD ["bun", "index.ts"]
