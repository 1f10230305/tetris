import { useEffect, useState } from 'react';

export const useTurn = () => {
  const [startTime, setStartTime] = useState(Date.now());
  const [turnCount, setTurnCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTurnCount(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearTimeout(timer);
  }, [turnCount, startTime]);

  return turnCount;
};
