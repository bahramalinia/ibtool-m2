#!/bin/bash
LOGFILE="/home/ec2-user/userdata.log"
exec > >(tee -a ${LOGFILE} | logger -t userdata -s 2>/dev/console) 2>&1

echo "Starting user data script..."

echo "Updating yum packages..."
yum update -y

echo "Installing dependencies..."
yum install -y yum-utils device-mapper-persistent-data lvm2

echo "Adding Docker repository..."
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

echo "Installing Docker..."
yum install -y docker-ce docker-ce-cli containerd.io

echo "Starting Docker service..."
systemctl start docker

echo "Enabling Docker service to start on boot..."
systemctl enable docker

echo "Adding ec2-user to the Docker group..."
usermod -a -G docker ec2-user

echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/2.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "Building Docker images for frontend..."
cd /home/ec2-user/ibtool-fe
docker build -t ibtool .

echo "Building Docker images for backend..."
cd /home/ec2-user/ibtool-be
docker build -t ibtoolbe .

echo "Creating docker-compose.yml file..."
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

echo "Starting Docker Compose..."
cd /home/ec2-user
docker-compose up -d

echo "User data script completed."
