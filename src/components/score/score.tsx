import React, { useContext } from 'react';
import { GameContext } from '../..';
import styles from './score.module.css';

const Score: React.FC = () => {
  const { data } = useContext(GameContext);
  const { score } = data;

  return (
    <div className={styles.root}>{`score: ${score}`}</div>
  );
}

Score.displayName = 'score';
export default Score;