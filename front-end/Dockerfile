FROM node:18-alpine3.19

# Declaring env
ENV NODE_ENV development
WORKDIR /app

# COPY [host machine] [container]
COPY package.json ./

RUN npm install react-scripts --legacy-peer-deps

RUN npm install -g npm@latest

COPY . .

# Starting our application
RUN npm run build

FROM nginx:alpine

# Sao chép các tệp tĩnh từ giai đoạn build vào thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng 80 để cho Nginx phục vụ các tệp tĩnh
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]