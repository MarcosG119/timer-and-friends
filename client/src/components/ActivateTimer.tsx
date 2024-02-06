import React, { useState } from 'react';
import Timer from './Timer';
import { Socket } from 'socket.io-client';
import {generate} from 'random-words';

import './ActivateTimer.css';


interface ActiveTimerProps {
    socket: Socket;
}

const ActivateTimer: React.FC<ActiveTimerProps> = ({ socket }) => {

    const [activeTimer, setActiveTimer] = useState<boolean>(false);
    const [room, setRoom] = useState<string>('');
    
    
    const handleActivateTimer = () => {
        let roomName = room;
        if(room == '') {
            roomName = (generate({exactly: 3, maxLength: 5}) as string[]).join('-');
        } 
        setRoom(roomName);
        console.log('room:', roomName);
        socket.emit('join_room', roomName);
        setActiveTimer(true);
    }

    const handleClipboard = () => {
        navigator.clipboard.writeText(room);
        alert('Room name copied to clipboard! Share the room name with your friends to get started!');
    }


    return (
        <>





        
            {!activeTimer && 
            <div>
                <input
                    className='room-input'
                    type="text"
                    placeholder="Room name..."
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                /> <br />
                <button onClick={handleActivateTimer}>Press me to get started!</button>
            </div>
            }



            {activeTimer && 
                <>
                    <h3>Room: <button style={{ backgroundColor: 'none' }} onClick={handleClipboard}>{room}</button></h3>
                    <Timer socket={socket} room={room}/>
                </>
            }
        </>
    );
};

export default ActivateTimer;