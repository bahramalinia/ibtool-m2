#!/bin/bash
LOGFILE="/home/ec2-user/userdata.log"
exec > >(sudo tee -a ${LOGFILE} | logger -t userdata -s 2>/dev/console) 2>&1

echo "Starting user data script..."

echo "Updating yum packages..."
sudo yum update -y

echo "Installing dependencies..."
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

echo "Installing Docker..."
sudo yum-config-manager --save --setopt=docker-ce-stable.skip_if_unavailable=true

sudo amazon-linux-extras install docker

echo "Enabling Docker service to start on boot..."
sudo systemctl enable docker
sudo systemctl start docker

echo "Adding ec2-user to the Docker group..."
sudo usermod -a -G docker ec2-user

echo "Building Docker images for frontend..."
cd /home/ec2-user/ibtool-fe
sudo docker build -t ibtool .

echo "Building Docker images for backend..."
cd /home/ec2-user/ibtool-be
sudo docker build -t ibtoolbe .

echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adding Docker Compose to the PATH
export PATH=$PATH:/usr/local/bin
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify Docker Compose installation
docker-compose version

echo "Creating docker-compose.yml file..."
cat <<EOT | sudo tee /home/ec2-user/docker-compose.yaml
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
sudo docker-compose up -d

echo "User data script completed."
