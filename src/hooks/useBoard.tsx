import { useCallback, useEffect, useMemo, useState } from 'react';
import { createArray } from '../utils/createArray';
import { mino } from '../utils/mino';
import { turnArray } from '../utils/turnArray';
import { useTurn } from './useTurn';

export const useBoard = () => {
  const [stockedBlocks, setStockedBlocks] = useState(createArray(10, 24, 0));
  const [floatingBlock, setFloatingBlock] = useState({
    ...mino[0],
    startTurn: 0,
    position: {
      top: 1,
      left: 3,
    },
    rotate: 0,
  });

  const turnCount: number = useTurn();

  const topPosition: number = useMemo(() => {
    return turnCount - floatingBlock.startTurn + floatingBlock.position.top;
  }, [floatingBlock, turnCount]);

  const filledLine: number[] = useMemo(() => {
    const filledLine: number[] = [];
    for (let i = 0; i < stockedBlocks.length; i++) {
      filledLine.push(i);
    }
    return filledLine;
  }, [stockedBlocks]);

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
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      if (board[y + topPosition] === undefined) {
        break;
      }
      if (!board[y + topPosition][x + floatingBlock.position.left]) {
        board[y + topPosition][x + floatingBlock.position.left] = turnArray(
          floatingBlock.shape,
          floatingBlock.rotate
        )[y][x]
          ? floatingBlock.type
          : 0;
      }
    }
    return board;
  }, [floatingBlock, stockedBlocks, topPosition, floatingBlockSize]);

  const canMove = useCallback(
    (toX: -1 | 0 | 1, toY: -1 | 0 | 1): boolean => {
      const edgeFloatingBlock: number[][] = turnArray(floatingBlock.shape, floatingBlock.rotate);
      for (let i = 0; i < floatingBlockSize ** 2; i++) {
        const x: number = i % floatingBlockSize;
        const y: number = Math.floor(i / floatingBlockSize);
        const terms: boolean[] = [
          turnArray(floatingBlock.shape, floatingBlock.rotate)[y][x] === 1,
          turnArray(floatingBlock.shape, floatingBlock.rotate)[y + toY] !== undefined &&
            turnArray(floatingBlock.shape, floatingBlock.rotate)[y + toY][x + toX] === 1,
        ];
        if (terms.every((v) => v)) {
          edgeFloatingBlock[y][x] === 0;
        }
      }
      for (let i = 0; i < floatingBlockSize ** 2; i++) {
        const x: number = i % floatingBlockSize;
        const y: number = Math.floor(i / floatingBlockSize);
        const terms: boolean[] = [
          edgeFloatingBlock[y][x] === 1,
          board[y + topPosition + toY] === undefined ||
            stockedBlocks[y + topPosition + toY + 3][x + floatingBlock.position.left + toX] !== 0,
        ];
        if (terms.every((v) => v)) {
          return false;
        }
      }
      return true;
    },
    [board, floatingBlock, floatingBlockSize, stockedBlocks, topPosition]
  );

  const stockBlock = useCallback(() => {
    const newStockedBlocks: number[][] = [...stockedBlocks];
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      if (turnArray(floatingBlock.shape, floatingBlock.rotate)[y][x]) {
        newStockedBlocks[y + topPosition + 3][x + floatingBlock.position.left] = floatingBlock.type;
      }
    }
    setStockedBlocks(newStockedBlocks);
  }, [floatingBlock, floatingBlockSize, stockedBlocks, topPosition]);

  const putFloatingBlocks = useCallback(() => {
    if (!canMove(0, 1)) {
      setFloatingBlock({
        ...mino[floatingBlock.type === 7 ? 0 : floatingBlock.type],
        position: {
          top: 1,
          left: 3,
        },
        startTurn: turnCount,
        rotate: 0,
      });
      stockBlock();
    }
  }, [canMove, floatingBlock, stockBlock, turnCount]);

  useEffect(() => {
    putFloatingBlocks();
  }, [turnCount, putFloatingBlocks]);

  useEffect(() => {
    const keydown = (event: WindowEventMap['keydown']) => {
      const moveBlock = (x: number, y: number) => {
        setFloatingBlock({
          ...floatingBlock,
          position: {
            top: floatingBlock.position.top + y,
            left: floatingBlock.position.left + x,
          },
        });
        putFloatingBlocks();
      };
      if (event.key === 'ArrowRight' && canMove(1, 0)) {
        moveBlock(1, 0);
      }
      if (event.key === 'ArrowLeft' && canMove(-1, 0)) {
        moveBlock(-1, 0);
      }
      if (event.key === 'ArrowDown' && canMove(0, 1)) {
        moveBlock(0, 1);
      }
      if (event.key === 'ArrowUp' && canMove(0, -1)) {
        setFloatingBlock({
          ...floatingBlock,
          rotate: floatingBlock.rotate + 90,
        });
        console.table(turnArray(floatingBlock.shape, floatingBlock.rotate));
      }
    };

    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, [floatingBlock, canMove, putFloatingBlocks]);

  return { board, floatingBlock };
};
