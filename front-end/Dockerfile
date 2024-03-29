FROM node:18-alpine3.19

# Declaring env
ENV NODE_ENV development

# COPY [host machine] [container]
COPY package.json ./

RUN npm install -g npm@latest

RUN npm install react-scripts

COPY . .

# Starting our application
CMD ["npm", "run", "build"]