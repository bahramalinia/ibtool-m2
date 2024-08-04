FROM ubuntu:latest

# Install Node.js
RUN apt-get update --fix-missing && \
    apt-get -y install curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get -y install nodejs

# Set the working directory
WORKDIR /app

# Copy the application source code
COPY . .

# Install application dependencies
RUN npm install

# Build the application (assuming it is a React/Vue/Angular app)
RUN npm run build

# Debugging: List the contents of the build directory to verify
RUN ls -l /app/dist

# Install NGINX
RUN apt-get update && \
    apt-get install -y nginx

# Create directory for NGINX HTML files if it doesn't exist
RUN mkdir -p /var/www/html

# Copy the build output to NGINX's html directory
RUN cp -r /app/* /var/www/html/

# Copy NGINX configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Command to run NGINX
CMD ["nginx"]
