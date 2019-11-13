# build stage
FROM node:10
LABEL stage=builder

WORKDIR /app

COPY . .
RUN npm run build

# nginx stage
FROM nginx:alpine
EXPOSE 80

COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]