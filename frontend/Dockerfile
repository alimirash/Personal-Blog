FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with specific permissions
RUN npm install

# Install Tailwind CSS and typography plugin (combine with previous npm install to reduce layers)
COPY tailwind.config.js postcss.config.js ./

# Copy project files
COPY . .

# Build for production
RUN npm run build

# Use a simpler approach to serve files
EXPOSE 3000
CMD ["npm", "start"]
