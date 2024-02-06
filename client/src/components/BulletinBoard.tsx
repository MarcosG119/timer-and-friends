import React, { useState, useEffect } from 'react';

import './BulletinBoard.css';


import { Socket } from 'socket.io-client';

interface BulletinBoardProps {
    socket: Socket;
    room: string;
}

const BulletinBoard: React.FC<BulletinBoardProps> = ({ socket, room }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const date = new Date().toLocaleTimeString();
        if (name && message) {
            const newMessage = `${date} - ${name}: ${message}`;
            socket.emit('send_message', room, newMessage);
            setMessages([...messages, newMessage]);
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
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>


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