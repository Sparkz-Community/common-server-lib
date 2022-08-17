# build stage
FROM node:lts-alpine as client-stage
ARG APP_BASEPATH
ENV APP_BASEPATH=${APP_BASEPATH:-/app}

WORKDIR /app
COPY . .
RUN rm -rf node_modules package-lock.json server; npm install -g npm@latest; npm -v; npm install; npm audit fix; npm install -g @quasar/cli @vue/cli
RUN export QENV=production; quasar build

# production stage
FROM nginx:stable-alpine as client-prod
COPY --from=client-stage /app/dist/spa /usr/share/nginx/html
RUN rm -v /etc/nginx/conf.d/default.conf
COPY docker/app.conf /etc/nginx/conf.d/app.conf
COPY docker/error.html /usr/share/nginx/html/error.html
EXPOSE 80
WORKDIR /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
