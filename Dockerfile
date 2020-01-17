FROM trafex/alpine-nginx-php7:1.3.0

USER root
RUN apk add php7-tokenizer

COPY deployments/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

USER nobody

COPY --chown=nobody . /var/www/html/

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]