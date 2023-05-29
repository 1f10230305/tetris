import { useCallback, useEffect, useMemo, useState } from 'react';
import { createArray } from '../utils/createArray';
import { mino } from '../utils/mino';
import { turnArray } from '../utils/turnArray';
import { useTurn } from './useTurn';

export const useBoard = () => {
  const [stockedBlocks, setStockedBlocks] = useState<number[][]>(createArray(10, 24, 0));
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

  const board: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[][] = useMemo(() => {
    const board: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[][] = createArray(10, 21, 0).map(
      (y: number[], indexY: number) => {
        return y.map((x: number, indexX: number) => stockedBlocks[indexY + 3][indexX]);
      }
    ) as (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[][];
    const floatingBlockSize: number = floatingBlock.shape.length;
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      if (
        board[y + topPosition] !== undefined &&
        !board[y + topPosition][x + floatingBlock.position.left]
      ) {
        board[y + topPosition][x + floatingBlock.position.left] = (turnArray(
          floatingBlock.shape,
          floatingBlock.rotate
        )[y][x] * floatingBlock.type) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
      }
    }
    return board;
  }, [stockedBlocks, floatingBlock, topPosition]);

  const canMove = useCallback(
    (toX: 1 | 0 | -1, toY: 1 | 0 | -1) => {
      const turnedBlock: number[][] = turnArray(floatingBlock.shape, floatingBlock.rotate);
      const edgeFloatingBlock = turnedBlock.map((row: number[], y: number) => {
        return row.map((block: number, x: number) => {
          const terms: boolean[] = [
            turnedBlock[y][x] === 1,
            turnedBlock[y + toY] !== undefined && turnedBlock[y + toY][x + toX] === 1,
          ];
          return terms.every((v) => v) || !turnedBlock[y][x] ? 0 : 1; // eslint-disable-line max-nested-callbacks
        });
      });
      return edgeFloatingBlock
        .map((row: number[], y: number) => {
          return row.filter((block: number, x: number) => {
            if (block !== 0) {
              const terms = [
                stockedBlocks[y + topPosition + toY + 3] === undefined,
                stockedBlocks[y + topPosition + toY + 3] !== undefined &&
                  stockedBlocks[y + topPosition + toY + 3][
                    x + floatingBlock.position.left + toX
                  ] !== 0,
              ];
              return terms.some((v) => v); // eslint-disable-line max-nested-callbacks
            }
          });
        })
        .every((v) => !v.length);
    },
    [floatingBlock, stockedBlocks, topPosition]
  );

  const stockBlock = useCallback(() => {
    const floatingBlockSize: number = floatingBlock.shape.length;
    const turnedBlock: number[][] = turnArray(floatingBlock.shape, floatingBlock.rotate);
    const newStockedBlocks: number[][] = [...stockedBlocks];
    for (let i = 0; i < floatingBlockSize ** 2; i++) {
      const x: number = i % floatingBlockSize;
      const y: number = Math.floor(i / floatingBlockSize);
      if (newStockedBlocks[y + topPosition + 3] !== undefined && turnedBlock[y][x]) {
        newStockedBlocks[y + topPosition + 3][x + floatingBlock.position.left] = floatingBlock.type;
      }
    }
    setStockedBlocks(newStockedBlocks);
  }, [floatingBlock, stockedBlocks, topPosition]);

  useEffect(() => {
    const changeMino = () => {
      if (!canMove(0, 1)) {
        setFloatingBlock({
          ...mino[floatingBlock.type % 7],
          position: {
            top: 1,
            left: 3,
          },
          startTurn: turnCount,
          rotate: 0,
        });
        stockBlock();
      }
    };
    changeMino();
    const keydown = (event: WindowEventMap['keydown']) => {
      const moveBlock = (x: number, y: number) => {
        setFloatingBlock({
          ...floatingBlock,
          position: {
            top: floatingBlock.position.top + y,
            left: floatingBlock.position.left + x,
          },
        });
      };
      changeMino();
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
      }
    };

    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, [floatingBlock, canMove, stockBlock, turnCount]);

  return { board, floatingBlock };
};
