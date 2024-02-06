import React from 'react';
import './App.css';
import ActivateTimer from './components/ActivateTimer.tsx';
import { io } from 'socket.io-client';

 const socket = io('http://localhost:3000');




function App() {



    return (
        <>
            <h1>Timer and Friends</h1>
        
            <h6>Start a timer and share the link with your friends!</h6>

            <ActivateTimer socket={socket}/>
        </>
    );
}

export default App
