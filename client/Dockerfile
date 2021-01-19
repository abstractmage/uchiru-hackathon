FROM node:14.15.4-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm set progress=false && \
    npm ci
COPY . .
RUN npm run build

FROM uchiru/spa-base:v0.7
ENV BASE_PATH=/kahoot
COPY --from=build-stage /app/build/ /var/www/