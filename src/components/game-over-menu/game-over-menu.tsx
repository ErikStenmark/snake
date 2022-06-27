import React from 'react';
import { useMenu } from '../../menu-context';
import Menu from '../menu';
import style from './game-over-menu.module.css';

type GameOverMenuProps = {
  score: number;
}

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
          { name: 'play again', action: playAgain },
          { name: 'main menu', action: () => setEndScore(undefined) }
        ]}
      >

        <p className={style.row}>{'- game over -'}</p>
        <p className={style.row}>{`score: ${score}`}</p>
      </Menu>
    </div >
  )
}

GameOverMenu.displayName = 'PauseMenu';
export default GameOverMenu;