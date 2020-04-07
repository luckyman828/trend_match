FROM trafex/alpine-nginx-php7:1.3.0

USER root
RUN apk add php7-tokenizer php7-pdo_mysql

COPY deployments/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

USER nobody

COPY --chown=nobody . /var/www/html/

ENTRYPOINT [ "./entry-point.sh" ]