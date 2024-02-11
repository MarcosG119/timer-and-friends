# Stage 1: Build the app
#Run docker buildx build --push --platform linux/arm/v7,linux/arm64/v8,linux/amd64 -t marcosg119/timer-and-friends:client . to avoid exec architecture error
FROM node:alpine as build

# Working directory that we'll be using
WORKDIR /app

# Copy the least likely piece to be changed to utilize caching
COPY package*.json ./

# Install packages needed for the app
RUN npm install --verbose

# Copy the rest of the app
COPY . ./

# Build your app
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:stable-alpine

# Copy built app from the build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Note to expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
