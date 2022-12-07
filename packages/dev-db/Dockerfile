FROM postgres:14-alpine

WORKDIR /

COPY ./wait-for.sh ./

COPY ./postgresql.conf /etc/postgresql/postgresql.conf

COPY ./sql_dump.sql /docker-entrypoint-initdb.d/