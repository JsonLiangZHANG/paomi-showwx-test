stareal移动端后台接口

生产环境部署

nginx：
/etc/init.d/nginx start/stop/restart/reload
apache:
/etc/init.d/httpd start/stop/restart 
mysql:
/etc/init.d/mysqld start/stop/restart 
php-fpm:
/etc/init.d/php-fpm start/stop/restart
redis
/usr/local/bin/redis-server &

set global max_allowed_packet = 128*1024*1024*10;
show VARIABLES like '%max_allowed_packet%';