#
# Nginx proxy container. take from https://github.com/helderco/docker-nginx-extras/blob/master/Dockerfile
#

FROM ubuntu:14.04
MAINTAINER Manu

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C300EE8C && \
    echo "deb http://ppa.launchpad.net/nginx/stable/ubuntu trusty main" >> /etc/apt/sources.list

ENV NGINX_VERSION 1.8.0-1+trusty1

RUN apt-get update && \
    apt-get install -y ca-certificates nginx-extras && \
    rm -rf /var/lib/apt/lists/*

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Define mountable directories.
VOLUME ["/etc/nginx/certs", "/var/log/nginx"]

COPY _docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]









