# Use an appropriate Node.js base image
FROM --platform=linux/amd64 node:alpine as build


# Set the working directory to /server
WORKDIR /server

# copy package.json and package-lock.json into the container at /server
COPY package*.json ./

# install dependencies
RUN npm install

# Copy the current directory contents into the container at /server
COPY . .

# Make port 9000 available to the world outside this container
EXPOSE 9000

# Run the app when the container launches
CMD ["npm", "start"]
