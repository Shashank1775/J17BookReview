import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PomodorianTimer() {
    const [timer, setTimer] = useState<number>(25 * 60); // Initial timer set to 25 minutes in seconds
    const [timerType, setTimerType] = useState<string>("pomodoro"); // Initial timer type
    const [isRunning, setIsRunning] = useState<boolean>(false); // Timer running status

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval!); // Ensure interval is defined before clearing
            alert("Timer ended!"); // Alert when the timer ends
        }
        return () => {
            if (interval) clearInterval(interval); // Clear interval if it exists
        };
    }, [isRunning, timer]);

    const startTimer = (duration: number) => {
        setTimer(duration);
        setIsRunning(true);
    };

    const stopTimer = () => {
        setIsRunning(false);
    };

    const handlePomodoro = () => {
        setTimerType("pomodoro");
        startTimer(25 * 60);
    };

    const handleShortBreak = () => {
        setTimerType("short");
        startTimer(5 * 60);
    };

    const handleLongBreak = () => {
        setTimerType("long");
        startTimer(15 * 60);
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="p-4">
            <div className="flex justify-center gap-4 mb-4">
                <Button className="bg-blue-500" onClick={handlePomodoro}>Pomodoro</Button>
                <Button className="bg-green-500" onClick={handleShortBreak}>Short Break</Button>
                <Button className="bg-yellow-500" onClick={handleLongBreak}>Long Break</Button>
            </div>
            <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold">
                    {timerType === "pomodoro" ? "Pomodoro Timer" : timerType === "short" ? "Short Break Timer" : "Long Break Timer"}
                </h1>
            </div>
            <div className="flex justify-center items-center mt-4">
                <h2 className="text-xl">{formatTime(timer)}</h2>
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <Button className="bg-red-500" onClick={stopTimer}>Stop</Button>
                {isRunning ? (
                    <Button className="bg-blue-500" onClick={() => setIsRunning(false)}>Pause</Button>
                ) : (
                    <Button className="bg-blue-500" onClick={() => setIsRunning(true)}>Start</Button>
                )}
            </div>
        </div>
    );
}
