import './App.css';
import ActivateTimer from './components/ActivateTimer.tsx';
import { io } from 'socket.io-client';

const socket = io("timer-and-friends-api.onrender.com", {transports: ['websocket']});

try{
    socket.on("successful_connection", () => {
        console.log("successful client connection");
    });
} catch (e) {
    console.log(e);
}

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
