FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Tailwind CSS and typography plugin
RUN npm install --save-dev tailwindcss postcss autoprefixer @tailwindcss/typography

# Copy project files
COPY . .

# Build for production
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]
