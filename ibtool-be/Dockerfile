FROM node:16.14.0
# Create app directory
WORKDIR /app
COPY package*.json ./
COPY src src
COPY .babelrc ./
COPY .eslintrc.js ./
COPY ReadMe.md ./
COPY webpack.config.js ./
RUN npm install
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start"]
