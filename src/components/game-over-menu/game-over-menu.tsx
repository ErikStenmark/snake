import React from 'react';
import { useMenu } from '../../menu-context';
import Menu from '../menu';
import style from './game-over-menu.module.css';
import classnames from 'classnames';

export type GameOverMenuProps = {
  score: number;
}

export const gameOverText = '- game over -';
export const gameOverscoreText = 'score:'
export const goMenuPlayAgainText = 'play again';
export const goMenuMainMenuText = 'main menu';

const GameOverMenu: React.FC<GameOverMenuProps> = ({ score }) => {
  const { setEndScore, setEngineOn } = useMenu()

  const playAgain = () => {
    setEndScore(undefined);
    setEngineOn(true);
  }

  return (
    <div className={style.root}>
      <Menu
        items={[
          { name: goMenuPlayAgainText, action: playAgain },
          { name: goMenuMainMenuText, action: () => setEndScore(undefined) }
        ]}
      >
        <p className={classnames(style.row, style.main)}>{gameOverText}</p>
        <p className={style.row}>{`${gameOverscoreText} ${score}`}</p>
      </Menu>
    </div >
  )
}

GameOverMenu.displayName = 'PauseMenu';
export default GameOverMenu;