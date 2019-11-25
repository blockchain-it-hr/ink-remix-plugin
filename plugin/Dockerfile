# build stage
FROM node:10.15.1 as build
LABEL stage=builder

WORKDIR /app

COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "serve"]

# nginx stage
#FROM nginx:alpine
#EXPOSE 80

#COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build /app/dist /usr/share/nginx/html

#CMD ["nginx", "-g", "daemon off;"]
