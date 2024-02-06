import React, { useState, useEffect } from 'react';
import './Timer.css';
import mainAlarm from '../sounds/mixkit-game-notification-wave-alarm-987.wav';
import cycleAlarm from '../sounds/mixkit-interface-hint-notification-911.wav';
import BulletinBoard from './BulletinBoard';   


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


    useEffect(() => {
        socket.on("user_joined", (socket_id) => {
            socket.emit('new_user_state', socket_id, inputTime, remainingTime, isRunning, timerPaused, onBreak, pomodoroCycles, pomodoroBreakTime);
        });

        if(!inputTime && !remainingTime && !isRunning && !timerPaused && !onBreak && !pomodoroCycles && !pomodoroBreakTime) {
            socket.on("receive_session_state", (inputTime, remainingTime, isRunning, timerPaused, onBreak, pomodoroCycles, pomodoroBreakTime) => {
                setInputTime(inputTime);
                setRemainingTime(remainingTime);
                setIsRunning(isRunning);
                setTimerPaused(timerPaused);
                setOnBreak(onBreak);
                setPomodoroCycles(pomodoroCycles);
                setPomodoroBreakTime(pomodoroBreakTime);
            });
        }

        socket.on("receive_time", (time) => {
            setInputTime(time);
        });

        socket.on("receive_pomodoro_cycles", (cycles) => {
            setPomodoroCycles(cycles);
        });

        socket.on("receive_start_timer", (remainingTime, running) => {
            setRemainingTime(remainingTime);
            setIsRunning(running);
        })

        socket.on("receive_pomodoro_break_time", (breakTime) => {
            setPomodoroBreakTime(breakTime);
        });

        socket.on("receive_resume_timer", (timerPaused, isRunning) => {
            setTimerPaused(timerPaused);
            setIsRunning(isRunning);
        });

        socket.on("receive_resume_pom_timer", (timerPaused, isRunning) => {
            setTimerPaused(timerPaused);
            setIsRunning(isRunning);
        });

        socket.on("receive_pause_timer", (timerPaused) => {
            setTimerPaused(timerPaused);
        });

        socket.on("receive_clear_timer", (remainingTime, pomodoroCycles, isRunning) => {
            setRemainingTime(remainingTime);
            setPomodoroCycles(pomodoroCycles);
            setIsRunning(isRunning);
        });

        socket.on("receive_add_time", (remainingTime1) => {
            setRemainingTime(remainingTime1);
        });

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
                if(isRunning){
                    mainAlarmSound.play();
                }
                
                setIsRunning(false);
                
            }
            
        }

        return () => clearInterval(timerInterval);
    }, [socket,isRunning,remainingTime,timerPaused]);

  const handleStartTimer = () => {

    if(!timerPaused) { 
        //if the timer is not paused, start a new timer
        const timeInMinutes = parseInt(inputTime);
        if (!isNaN(timeInMinutes)) {
            setRemainingTime(timeInMinutes * 60); // * 60 to convert to minutes
            setIsRunning(true);
            socket.emit('start_timer', room, timeInMinutes, true);
        }
    } else {
        //if the timer is paused, resume the timer
        if (!isNaN(remainingTime)) {
            setTimerPaused(false);
            setIsRunning(true);
            socket.emit('resume_timer', room, false, true);
        }
    }
  };

  const handleStartPomodoroTimer = () => {
    if(!timerPaused) {
        const timeInMinutes = parseInt(pomodoroBreakTime);
        if (!isNaN(timeInMinutes)) {
            setRemainingTime(timeInMinutes * 60);  // * 60 to convert to minutes
            setIsRunning(true);
        }
    } else {
        if (!isNaN(remainingTime)) {
            setTimerPaused(false);
            setIsRunning(true);
            socket.emit('resume_pom_timer', room, false, true);
        }
    }
  };

    const handlePauseTimer = () => {
        setTimerPaused(true);
        socket.emit('pause_timer', room, true);
    };

    const handleClearTimer = () => {
        setRemainingTime(0);
        setPomodoroCycles(0);
        setIsRunning(false);
        socket.emit('clear_timer', room, 0, 0, false);
    };

    const handleAddOneMinute = () => {
        const time = remainingTime + 60;
        setRemainingTime(time);
        socket.emit('add_time', room, time);
    };

    const handleAddFiveMinutes = () => {
        const time = remainingTime + 300;
        setRemainingTime(time);
        socket.emit('add_time', room, time);
    };

    const handleInputTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputTime(e.target.value);
        socket.emit('input_time', room, e.target.value);
    };

    const handlePomodoroCycles = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPomodoroCycles(parseInt(e.target.value));
        socket.emit('pomodoro_cycles', room, e.target.value);
    };
    
    const handlePomodoroBreakTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPomodoroBreakTime(e.target.value);
        socket.emit('pomodoro_break_time', room, e.target.value);
    };


    const muteSounds = () => {
        mainAlarmSound.muted = !mainAlarmSound.muted;
        cycleAlarmSound.muted = !cycleAlarmSound.muted;
    }


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
                        onChange={(e) => handleInputTime(e)}
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
                            onChange={(e) => handlePomodoroCycles(e)}
                            placeholder="0"
                        />
                        &emsp;Break time:
                        <input
                            className="input-small"
                            type="text"
                            value={pomodoroBreakTime}
                            onChange={(e) => handlePomodoroBreakTime(e)}
                            placeholder="00"                        />:00
                    </h4>
                </div>
            </div>
        }


        {isRunning && 
            <div>
                <h2>{ !onBreak ? <>Time Left - </> : <>Break Time Left - </> } {formatTime(remainingTime)}</h2>
            </div>
        }



      <button onClick={muteSounds}>{mainAlarmSound.muted ? <>Toggle Sound On</> : <>Toggle Sound Off</>}</button>
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
      


        <BulletinBoard 
            isRunning={isRunning} 
            timerPaused={timerPaused} 
            onBreak={onBreak}
            socket={socket} 
            room={room}
        />
    </div>
  );
};
export default TimerComponent;