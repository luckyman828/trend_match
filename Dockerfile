FROM trafex/alpine-nginx-php7:1.3.0

USER root
RUN apk add php7-tokenizer php7-pdo_mysql

COPY deployments/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

USER nobody
RUN rm .env.example

COPY --chown=nobody . /var/www/html/

RUN php artisan config:clear

ENTRYPOINT [ "./entry-point.sh" ]