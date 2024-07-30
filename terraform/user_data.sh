#!/bin/bash
yum update -y
yum install -y docker
service docker start
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/2.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Build Docker images
cd /home/ec2-user/ibtool-fe
docker build -t ibtool .

cd /home/ec2-user/ibtool-be
docker build -t ibtoolbe .

# Create docker-compose.yml
cat <<EOT > /home/ec2-user/docker-compose.yaml
version: "3.7"

services:
  mongo:
    image: mongo
    container_name: mongo
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: "ibtool"
      MONGO_INITDB_ROOT_PASSWORD: "iBeeTim!"
      MONGO_INITDB_DATABASE: "ibtool"
    volumes: 
      - /root/ibtool/db:/data/db
    networks:
      - ibapp
    restart: always
  ibtoolbe:
    image: ibtoolbe
    container_name: ibtoolbe
    ports:
      - "8080:8080"
    depends_on:
      - "mongo"
    networks:
      - ibapp
    restart: always
  ibtool:
    image: ibtool
    container_name: ibtool
    ports:
      - "8090:80"
    depends_on:
      - "ibtoolbe"
    networks:
      - ibapp
    restart: always
networks:
  ibapp:
    driver: bridge
volumes:
  db:
EOT

# Start Docker Compose
cd /home/ec2-user
docker-compose up -d
