#!/bin/sh
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf