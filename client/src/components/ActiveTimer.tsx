import React, { useState } from 'react';
import Timer from './Timer';
import BulletinBoard from './BulletinBoard';   


import { Socket } from 'socket.io-client';

interface ActiveTimerProps {
    socket: Socket;
}

const ActiveTimer: React.FC<ActiveTimerProps> = ({ socket }) => {
    const [activeTimer, setActiveTimer] = useState<boolean>(false);
    
    
    const handleActivateTimer = () => {
        setActiveTimer(true);
    }


    return (
        <>





        
            {!activeTimer && 
            <>
                <button onClick={handleActivateTimer}>Press me to get started!</button>
            </>
            }



            {activeTimer && 
            <>
                <Timer socket={socket}/>
                <BulletinBoard socket={socket}/>
            </>
            }
        </>
    );
};

export default ActiveTimer;