# Use an appropriate Node.js base image
FROM node:alpine

# Set the working directory to /client
WORKDIR /client

# copy package.json and package-lock.json into the container at /client
COPY package*.json ./

# install dependencies
RUN npm install

# Copy the current directory contents into the container at /client
COPY . .

RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 8000

# Run the app when the container launches
CMD ["npm", "run", "preview"]
