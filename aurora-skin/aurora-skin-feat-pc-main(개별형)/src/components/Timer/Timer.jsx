import { useState, useEffect } from 'react';

import { number, func } from 'prop-types';

const Timer = ({ seconds, onTimeOutAction }) => {
  const [time, setTime] = useState({ minutes: Math.floor(seconds / 60), seconds: seconds % 60 });
  const [isTimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    setIsTimeOut(false);
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
        if (newSeconds < 0 && newMinutes < 0) {
          clearInterval(intervalId);
          setIsTimeOut(true);
          onTimeOutAction();

          return { minutes: 0, seconds: 0 };
        }

        return {
          minutes: newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  return (
    <div className="timer">
      <span className="count-down">
        유효시간{' '}
        {!isTimeOut ? (
          <span>
            {time.minutes.toString().padStart(2, '0')}:{time.seconds.toString().padStart(2, '0')}
          </span>
        ) : (
          <span>시간초과</span>
        )}
      </span>
    </div>
  );
};

export default Timer;

Timer.propTypes = {
  seconds: number,
  onTimeOutAction: func,
};
