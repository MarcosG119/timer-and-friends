const express = require('express');
const app = express();

const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);


    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} Joined Room: ${room}`);
    });


    socket.on("send_message", (room, newMessage) => {
        console.log(newMessage);
        socket.to(room).emit("receive_message", newMessage);
    })

    socket.on("startTimer", (inputTime) => {
        // Broadcast the start timer event to all connected clients
        io.emit("startTimer", inputTime);
    });

    socket.on("startPomodoroTimer", (pomodoroBreakTime) => {
        // Broadcast the start pomodoro timer event to all connected clients
        io.emit("startPomodoroTimer", pomodoroBreakTime);
    });

    socket.on("pauseTimer", () => {
        // Broadcast the pause timer event to all connected clients
        io.emit("pauseTimer");
    });

    socket.on("clearTimer", () => {
        // Broadcast the clear timer event to all connected clients
        io.emit("clearTimer");
    });

    socket.on("addOneMinute", () => {
        // Broadcast the add one minute event to all connected clients
        io.emit("addOneMinute");
    });

    socket.on("addFiveMinutes", () => {
        // Broadcast the add five minutes event to all connected clients
        io.emit("addFiveMinutes");
    });

    // Handle updates to the timer state from a specific client
    socket.on('updateTimer', (newRemainingTime) => {
        // Broadcast the updated remaining time to all connected clients
        io.emit('updateTimer', newRemainingTime);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});