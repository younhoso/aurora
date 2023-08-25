FROM nginx:1.17.8-alpine
LABEL version="1.0"
LABEL maintainer="dl_frontend@nhn-commerce.com"
LABEL Desciption="nginx:1.17.8-alpine + centos user + supervisor, shopby-nginx:1.17.8-alpine"

ARG HOME=/home/centos
ARG LOG=/logs
ARG WEB_ROOT=/home/centos/shopby-skin
ARG NGINX_ROOT=/etc/nginx
ARG UID=1000
ARG GID=1000
ARG USER=centos

# make centos home
RUN mkdir -p $HOME && chown $UID:$GID $HOME

# make directory logs
RUN mkdir -p $LOG && chown -R $UID:$GID $LOG

# Add a new user centos
RUN adduser -D -u $UID -g $GID -h $HOME $USER

EXPOSE 80
ENV PORT 80

ADD dist $WEB_ROOT
COPY /config/nginx.conf $NGINX_ROOT/nginx.conf
# /config/nginx.conf 파일은 젠킨스 잡 진행될 때 생성됩니다. 
# (shopby-skin 레포에서는 존재하지 않는 게 정상입니다.)

RUN chown -R $UID:$GID $WEB_ROOT
