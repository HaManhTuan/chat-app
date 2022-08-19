FROM mysql:8.0.20

ENV MYSQL_ROOT_PASSWORD=secret
ENV MYSQL_DATABASE=chat_app
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=secret

COPY ./mysql_custom.cnf /etc/mysql/conf.d/mysql_custom.cnf
RUN chmod 555 /etc/mysql/conf.d/mysql_custom.cnf
