FROM node:latest

MAINTAINER Emmanuel Chappat "emmanuel.chappat@gmail.com"

RUN npm install -g pm2@latest

#copy package.json first to allow caching this step. http://www.clock.co.uk/blog/a-guide-on-how-to-cache-npm-install-with-docker
ADD package.json /var/node_dependencies/package.json

RUN cd /var/node_dependencies && \
  npm install

VOLUME ["/var/node_dependencies/"]

RUN mkdir /var/www

# set final work dir
WORKDIR /var/www

# replace this with your application's default port
EXPOSE 4000

ENTRYPOINT ["pm2", "start", "--no-daemon", "_docker/pm2-nodejs/processes.json"]