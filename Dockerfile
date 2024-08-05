FROM node:20.16.0-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy source code
COPY . .

# Install dependencies
RUN pnpm install --prod

# Build the NestJS application
RUN pnpm run build

# Command to run the application
CMD ["pnpm", "run", "start:prod"]