FROM node:18-alpine3.19

# Declaring env
ENV NODE_ENV development

# COPY [host machine] [container]
COPY package.json ./

RUN npm install react-scripts --legacy-peer-deps

RUN npm install -g npm@latest



COPY . .

# Starting our application
RUN npm start