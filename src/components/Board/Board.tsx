import { useBoard } from '../../hooks/useBoard';
import styles from './Board.module.css';

export const Board = () => {
  const { board } = useBoard();
  return (
    <div className={styles.board}>
      {board.map((row, y) =>
        row.map((cell, x) => <div className={styles[`color-${board[y][x]}`]} key={`${x}_${y}`} />)
      )}
    </div>
  );
};
