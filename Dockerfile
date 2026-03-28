FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Create a non-root user and give it ownership of the app directory
RUN addgroup -S exchange && adduser -S exchange -G exchange \
    && chown -R exchange:exchange /usr/src/app

# Switch to the non-root user
USER exchange

# Expose the app port
EXPOSE 7000

# Run the app
CMD ["node", "dist/main.js"]