# stage-1 : dependencies 
FROM node:24-slim AS dependencies 
WORKDIR /usr/src/app 
ARG ROOT_CODES_PATH 
COPY ${ROOT_CODES_PATH}/package.json ${ROOT_CODES_PATH}/package-lock.json ./
RUN npm install --production=false --frozen-lockfile

# stage-2 : builder 
FROM node:24-slim AS builder 
WORKDIR /usr/src/app 
ARG ROOT_CODES_PATH 
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json ./
COPY --from=dependencies /usr/src/app/package-lock.json ./
COPY ${ROOT_CODES_PATH} ./
RUN npx nest build

# stage-3 : production-base
FROM node:24-slim AS production-base
WORKDIR /usr/src/app
ARG PORT=3000
ENV PORT=$PORT
ARG ROOT_CODES_PATH
COPY ${ROOT_CODES_PATH}/package.json ./
COPY --from=dependencies /usr/src/app/package-lock.json ./
RUN npm install --production=true --frozen-lockfile && npm cache clean --force
COPY --from=builder /usr/src/app/dist ./dist
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /usr/src/app
USER nodejs
EXPOSE $PORT

# stage-4 : local development
FROM production-base AS local
CMD ["node", "dist/main.js"]