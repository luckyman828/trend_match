#!/bin/sh
php artisan config:clear
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf