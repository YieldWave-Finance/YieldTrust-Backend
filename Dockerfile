FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Expose default application port
EXPOSE 3000

# Define default environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Run application
CMD [ "npm", "start" ]
