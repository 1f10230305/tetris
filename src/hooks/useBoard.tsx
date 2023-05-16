import { useEffect, useMemo, useState } from 'react';
import { createArray } from '../utils/createArray';
import { mino } from '../utils/mino';

export const useBoard = () => {
  const [stockedBlocks, setStockedBlocks] = useState(createArray(10, 0, 0));
  const [floatingBlock, setFloatingBlock] = useState({
    ...mino[0],
    position: {
      top: 1,
      left: 3,
    },
    rotate: 0,
  });

  const currentStockedBlocks: number[][] = useMemo(() => {
    const newBlocks: number[][] = JSON.parse(JSON.stringify(stockedBlocks));
    let i = 0;
    for (const row of newBlocks) {
      if (row.every((value) => value > 0)) {
        newBlocks.splice(i);
        i++;
      }
    }
    return newBlocks;
  }, [stockedBlocks]);

  const floatingBlockSize: number = useMemo(() => {
    return floatingBlock.shape.length;
  }, [floatingBlock]);

  const canPutDown: boolean = useMemo(() => {
    //
  }, [floatingBlock]);

  const putFloatingBlocks = () => {
    //
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      putFloatingBlocks();
    }, 1000);
    return () => clearInterval(timer);
  });

  const board: number[][] = useMemo(() => {
    const board: number[][] = createArray(10, 21, 0);
    const floatingBlockSize: number = floatingBlock.shape.length;
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      board[y + floatingBlock.position.top][x + floatingBlock.position.left] = floatingBlock.shape[
        y
      ][x]
        ? floatingBlock.type
        : 0;
    }
    return board;
  }, [floatingBlock]);

  return { board };
};
