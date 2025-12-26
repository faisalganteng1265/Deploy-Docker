FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
COPY generate_files.js ./
RUN npm install
RUN npm run prepare
COPY . .
EXPOSE 3000
CMD ["npm", "start"]