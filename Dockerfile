# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/domain/package.json ./packages/domain/package.json
COPY packages/imports/package.json ./packages/imports/package.json
RUN npm ci

FROM dependencies AS builder
COPY . .
RUN npm run build \
    && mkdir -p apps/web/.next/standalone/apps/web/.next \
    && cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static \
    && if [ -d apps/web/public ]; then cp -r apps/web/public apps/web/.next/standalone/apps/web/public; fi

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd --gid 1001 tradehq \
    && useradd --uid 1001 --gid 1001 --no-create-home --shell /usr/sbin/nologin tradehq
COPY --from=builder --chown=1001:1001 /app/apps/web/.next/standalone ./
USER 1001:1001
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/', {signal: AbortSignal.timeout(5000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "apps/web/server.js"]
