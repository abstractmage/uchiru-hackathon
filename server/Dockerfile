FROM node:14.15.4-alpine

# Create app directory
WORKDIR /app
COPY package*.json /app/

RUN npm ci
COPY . .

EXPOSE 3001
CMD ["npm", "start"]