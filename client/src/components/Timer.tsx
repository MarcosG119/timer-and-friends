import React, { useState, useEffect } from 'react';
import './Timer.css';
import mainAlarm from '../sounds/mixkit-game-notification-wave-alarm-987.wav';
import cycleAlarm from '../sounds/mixkit-interface-hint-notification-911.wav';

import { Socket } from 'socket.io-client';

interface TimerProps {
    socket: Socket;
    room: string;
}

const TimerComponent: React.FC<TimerProps> = ({ socket, room }) => {
    const [inputTime, setInputTime] = useState<string>('');
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [timerPaused, setTimerPaused] = useState<boolean>(false);
    const [onBreak, setOnBreak] = useState<boolean>(false);
    const [pomodoroCycles, setPomodoroCycles] = useState<number>(0);
    const [pomodoroBreakTime, setPomodoroBreakTime] = useState<string>('');
    const [mainAlarmSound] = useState(new Audio(mainAlarm));
    const [cycleAlarmSound] = useState(new Audio(cycleAlarm));

    socket;room;

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isRunning && remainingTime > 0 && !timerPaused) {
      timerInterval = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
        if(!onBreak && pomodoroCycles > 0){
            setOnBreak(true);
            handleStartPomodoroTimer();
            cycleAlarmSound.play();
        } else if(onBreak && pomodoroCycles > 0) {
            setOnBreak(false);
            handleStartTimer();
            setPomodoroCycles(pomodoroCycles - 1);
            cycleAlarmSound.play(); 
        } else {
            setIsRunning(false);
            mainAlarmSound.play();
        }
        
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, remainingTime, timerPaused]);

  const handleStartTimer = () => {
    if(!timerPaused) {
        const timeInMinutes = parseInt(inputTime);
        if (!isNaN(timeInMinutes)) {
            setRemainingTime(timeInMinutes); // * 60 to convert to minutes
            setIsRunning(true);
        }
    } else {
        if (!isNaN(remainingTime)) {
            setTimerPaused(false);
            setIsRunning(true);
        }
    }
  };

  const handleStartPomodoroTimer = () => {
    if(!timerPaused) {
        const timeInMinutes = parseInt(pomodoroBreakTime);
        if (!isNaN(timeInMinutes)) {
            setRemainingTime(timeInMinutes);  // * 60 to convert to minutes
            setIsRunning(true);
        }
    } else {
        if (!isNaN(remainingTime)) {
            setTimerPaused(false);
            setIsRunning(true);
        }
    }
  };

  const handlePauseTimer = () => {
    setTimerPaused(true);
   };

  const handleClearTimer = () => {
    setRemainingTime(0);
    setPomodoroCycles(0);
    setIsRunning(false);
  };

  const handleAddOneMinute = () => {
    setRemainingTime(prevTime => prevTime + 60);
  };

  const handleAddFiveMinutes = () => {
    setRemainingTime(prevTime => prevTime + 300);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
        



        {!isRunning && 
            <div>
                <div>
                <h2>Input Time:&nbsp;
                    <input
                        className="input"
                        type="text"
                        value={inputTime}
                        onChange={(e) => setInputTime(e.target.value)}
                        placeholder="00"
                        disabled={isRunning}
                    />
                    : 00
                </h2>
                </div>


                {/* interval settings */}
                <div>
                    <h3>Optional: Set Interval</h3>
                    <h4>Cycles:&nbsp;
                        <input
                            className="input-small"
                            type="number"
                            value={pomodoroCycles}
                            onChange={(e) => setPomodoroCycles(parseInt(e.target.value))}
                            placeholder="0"
                        />
                        &emsp;Break time:
                        <input
                            className="input-small"
                            type="text"
                            value={pomodoroBreakTime}
                            onChange={(e) => setPomodoroBreakTime(e.target.value)}
                            placeholder="00"                        />
                    </h4>
                </div>
            </div>
        }


        {isRunning && 
            <div>
                <h2>Time Left - {formatTime(remainingTime)}</h2>
            </div>
        }



      
      <button onClick={handleStartTimer} disabled={isRunning && !timerPaused}>
        Start Timer
      </button>
      <button onClick={handlePauseTimer} disabled={!isRunning}>
        Pause Timer
      </button>
      {isRunning && 
        <>
            <button onClick={handleClearTimer}>
                Clear Timer
            </button>
            <button onClick={handleAddOneMinute}>
                Add 1 Minute
            </button>
            <button onClick={handleAddFiveMinutes}>
                Add 5 Minutes
            </button>
        </>
      }
      
    </div>
  );
};
export default TimerComponent;