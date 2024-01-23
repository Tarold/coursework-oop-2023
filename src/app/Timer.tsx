import React, { useEffect } from 'react';

export const TimeInterval: React.FC<{
  time: Date;
  name: string;
  onEndTimer: VoidFunction;
}> = ({ time, name, onEndTimer }) => {
  useEffect(() => {
    const setNewTimeout = () => {
      const currentTime = new Date().getTime();
      const nextTime = new Date(time).getTime();
      const delay = nextTime - currentTime;

      const timeoutId = setTimeout(() => {
        onEndTimer();
      }, delay);

      return timeoutId;
    };

    const timeoutId = setNewTimeout();

    return () => clearTimeout(timeoutId);
  }, [time, onEndTimer]);

  return <div>наступний забор води на точке {name}</div>;
};
