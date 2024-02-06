import React, { useState, useEffect } from 'react';

import './BulletinBoard.css';


import { Socket } from 'socket.io-client';

interface BulletinBoardProps {
    socket: Socket;
    room: string;
    isRunning: boolean;
    timerPaused: boolean;
    onBreak: boolean;
}

const BulletinBoard: React.FC<BulletinBoardProps> = ({ socket, room, isRunning, timerPaused, onBreak }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [ownMessages, setOwnMessages] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const date = new Date().toLocaleTimeString();
        if (name && message) {
            const newMessage = `${date} - ${name}: ${message}`;
            socket.emit('send_message', room, newMessage);
            setMessages([...messages, newMessage]);
            setOwnMessages([...ownMessages, newMessage]);
            setMessage('');
        }
    };

    useEffect(() => {
        socket.on('receive_message', (newMessage) => {
            setMessages([...messages, newMessage]);
        });
    }, [socket,messages]);

    return (
        <div className="message-board">
            {(!isRunning || timerPaused || onBreak) && 
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul> || 
            <ul>
            {ownMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
            ))}
            </ul>
            }


            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                /> 
                <br/>
                <input
                    type="text"
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Post</button>
            </form>

        </div>
    );
};

export default BulletinBoard;