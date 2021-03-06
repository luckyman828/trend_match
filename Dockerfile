FROM trafex/alpine-nginx-php7:1.10.0

USER root
RUN apk add php7-tokenizer php7-pdo_mysql

COPY deployments/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

USER nobody

COPY --chown=nobody . /var/www/html/

RUN php artisan config:cache && php artisan route:cache

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]