import React from 'react';
import './App.css';
import ActiveTimer from './components/ActiveTimer';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');


function App() {



    return (
        <>
            <h1>Timer and Friends</h1>
        
            <h6>Start a timer and share the link with your friends!</h6>

            <ActiveTimer socket={socket}/>
        </>
    );
}

export default App
