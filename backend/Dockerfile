# Use Node 20 for compatibility with latest NestJS and Prisma
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma

#Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Optional: build if using TypeScript or want to precompile
RUN npm run build

# Expose port 
EXPOSE 3005

# Run the app
CMD ["npm", "run", "start:prod"]
