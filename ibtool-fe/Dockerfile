FROM ubuntu:latest

# install nodejs
RUN apt-get update --fix-missing
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_16.x  | bash -
RUN apt-get -y install nodejs

WORKDIR /app

COPY . /app
RUN npm install
COPY . /app



# install nginx
RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -f nginx


COPY ./nginx.conf /etc/nginx/nginx.conf
ADD . /var/www/html/
ADD . /

EXPOSE 80
CMD ["nginx"]

