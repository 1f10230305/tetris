import { useEffect, useMemo, useState } from 'react';
import { createArray } from '../utils/createArray';
import { mino } from '../utils/mino';

export const useBoard = () => {
  const [stockedBlocks, setStockedBlocks] = useState(createArray(10, 24, 0));
  const [floatingBlock, setFloatingBlock] = useState({
    ...mino[0],
    position: {
      top: 1,
      left: 3,
    },
    rotate: 0,
  });

  const filledLine: number[] = useMemo(() => {
    const filledLine: number[] = [];
    for (let i = 0; i < stockedBlocks.length; i++) {
      filledLine.push(i);
    }
    return filledLine;
  }, [stockedBlocks]);

  // const currentStockedBlocks: number[][] = useMemo(() => {
  //   const newBlocks: number[][] = JSON.parse(JSON.stringify(stockedBlocks));
  //   let i = 0;
  //   for (const row of newBlocks) {
  //     if (row.every((value) => value > 0)) {
  //       newBlocks.splice(i);
  //       i++;
  //     }
  //   }
  //   return newBlocks;
  // }, [stockedBlocks]);

  const floatingBlockSize: number = useMemo(() => {
    return floatingBlock.shape.length;
  }, [floatingBlock]);

  const board: number[][] = useMemo(() => {
    const board: number[][] = createArray(10, 21, 0);
    for (let y = 3; y < 24; y++) {
      for (let x = 0; x < 10; x++) {
        board[y - 3][x] = stockedBlocks[y][x];
      }
    }
    const floatingBlockSize: number = floatingBlock.shape.length;
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      if (board[y + floatingBlock.position.top] === undefined) {
        break;
      }
      if (!board[y + floatingBlock.position.top][x + floatingBlock.position.left]) {
        board[y + floatingBlock.position.top][x + floatingBlock.position.left] = floatingBlock
          .shape[y][x]
          ? floatingBlock.type
          : 0;
      }
    }
    return board;
  }, [floatingBlock, stockedBlocks]);

  const canPutDown: boolean = useMemo(() => {
    const bottomFloatingBlock: number[][] = [...floatingBlock.shape];
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      const terms: boolean[] = [
        floatingBlock.shape[y][x] === 1,
        floatingBlock.shape[y + 1] !== undefined && floatingBlock.shape[y + 1][x] === 1,
      ];
      if (terms.every((v) => v)) {
        bottomFloatingBlock[y][x] === 0;
      }
    }
    let canPutDown = true;
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      const terms: boolean[] = [
        bottomFloatingBlock[y][x] === 1,
        board[y + floatingBlock.position.top + 1] === undefined ||
          stockedBlocks[y + floatingBlock.position.top + 4][x + floatingBlock.position.left] !== 0,
      ];
      if (terms.every((v) => v)) {
        canPutDown = false;
        break;
      }
    }
    return canPutDown;
  }, [floatingBlock, floatingBlockSize, board, stockedBlocks]);

  const stockBlock = () => {
    const newStockedBlocks: number[][] = [...stockedBlocks];
    // if (newStockedBlocks.length > 21) {
    //   newStockedBlocks.splice(0, stockedBlocks.length - 21);
    // } else if (newStockedBlocks.length < 21) {
    //   newStockedBlocks.concat(createArray(10, 21 - stockedBlocks.length, 0));
    // }
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      if (floatingBlock.shape[y][x]) {
        // if (newStockedBlocks[y] === undefined) {
        //   newStockedBlocks = createArray(10, 1, 0).concat(newStockedBlocks);
        // }
        newStockedBlocks[y + floatingBlock.position.top + 3][x + floatingBlock.position.left] =
          floatingBlock.type;
      }
    }
    setStockedBlocks(newStockedBlocks);
  };

  const putFloatingBlocks = () => {
    if (canPutDown) {
      setFloatingBlock({
        ...floatingBlock,
        position: {
          top: floatingBlock.position.top + 1,
          left: floatingBlock.position.left,
        },
      });
    } else {
      setFloatingBlock({
        ...mino[floatingBlock.type === 7 ? 1 : floatingBlock.type],
        position: {
          top: 1,
          left: 3,
        },
        rotate: 0,
      });
      stockBlock();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      putFloatingBlocks();
    }, 300);
    return () => clearInterval(timer);
  });

  return { board };
};
