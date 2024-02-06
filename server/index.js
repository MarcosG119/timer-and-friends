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
        socket.to(room).emit("user_joined", socket.id);
    });

    socket.on("new_user_state", (socket_id, inputTime, remainingTime, isRunnig, timerPaused, onBreak, pomodoroCycles, pomodoroBreakTime) => {
        socket.to(socket_id).emit("receive_session_state", inputTime, remainingTime, isRunnig, timerPaused, onBreak, pomodoroCycles, pomodoroBreakTime);
    });

    socket.on("send_message", (room, newMessage) => {
        console.log(newMessage);
        socket.to(room).emit("receive_message", newMessage);
    });

    socket.on("input_time", (room, time) => {
        console.log(time);
        socket.to(room).emit("receive_time", time);
    });

    socket.on("pomodoro_cycles", (room, pomodoroCycles) => {
        console.log(pomodoroCycles);
        socket.to(room).emit("receive_pomodoro_cycles", pomodoroCycles);
    });

    socket.on("pomodoro_break_time", (room, pomodoroBreakTime) =>{
        console.log(pomodoroBreakTime);
        socket.to(room).emit("receive_pomodoro_break_time", pomodoroBreakTime);
    });

    socket.on("start_timer", (room, remainingTime, running) => {
        console.log(remainingTime);
        console.log(running);
        socket.to(room).emit("receive_start_timer", remainingTime, running);
    });

    socket.on("resume_timer", (room, timerPaused, isRunning) => {
        console.log(timerPaused);
        console.log(isRunning);
        socket.to(room).emit("receive_resume_timer", timerPaused, isRunning);
    });

    socket.on("resume_pom_timer", (room, timerPaused, isRunning) => {
        console.log(timerPaused);
        console.log(isRunning);
        socket.to(room).emit("receive_resume_pom_timer", timerPaused, isRunning);
    });

    socket.on("pause_timer", (room, timerPaused, isRunning) => {
        console.log(timerPaused);
        socket.to(room).emit("receive_pause_timer", timerPaused);
    });

    socket.on("clear_timer", (room, remainingTime, pomodoroCycles, isRunning) => {
        console.log(remainingTime);
        console.log(pomodoroCycles);
        console.log(isRunning);
        socket.to(room).emit("receive_clear_timer", remainingTime, pomodoroCycles, isRunning);
    
    });

    socket.on("add_time", (room, remainingTime) =>
    {
        console.log(remainingTime);
        socket.to(room).emit("receive_add_time", remainingTime);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});