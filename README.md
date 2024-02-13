# Timer and Friends

Ever been working with someone over zoom and wanted to set a pomodoro-like timer that you guys can both access and control? Don't worry, that problem has been solved. You can also share thoughts and ideas that came up while studying or working, the messages won't show until break time or after so that you don't get distracted. I don't have it deployed to the cloud because it costs money, but I'm going to get it deployed through render next. 

## Getting Started

1. ```$ cd client npm install && npm run dev && cd ../server npm install && npm run start```
2. Join a room by the name of your choice. If you do not choose a room, a room name will be auto-generated for you.
3. Set a timer, how long you want your breaks to be, and how many break cycles you want to have.
4. Chat with the other users of that timer, messages will only show when the timer is inactive or the break timer is active.

## Technologies used

The frontend is built on ReactTS. The frontend responds to changes from the server/backend which is built on Socket IO, NodeJS, and Express JS. You can also spin it up using Docker Desktop and Docker-Compose. However, if you want to take it a step further containerize the images in Kubernetes, edit the Terraform, and use Helm to manage the packages to deploy to a cloud service of your choice. 
