import { Board } from '../components/Board/Board';
import { Hover } from '../components/Hover/Hover';
import { Information } from '../components/Information/Information';
import { Next } from '../components/Next/Next';
import styles from './index.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <Hover />
      <Information />
      <Board />
      <Next />
    </div>
  );
};

export default Home;
