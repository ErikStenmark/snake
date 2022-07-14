import React from 'react';
import { useMenu } from '../../menu-context';
import styles from './score.module.css';

export const scoreText = 'score:';

const Score: React.FC = () => {
  const { data, isRunning } = useMenu();

  if (!data || !isRunning) {
    return null;
  }

  const { score } = data;
  return (
    <div className={styles.root}>{`${scoreText} ${score}`}</div>
  );
}

Score.displayName = 'score';
export default Score;