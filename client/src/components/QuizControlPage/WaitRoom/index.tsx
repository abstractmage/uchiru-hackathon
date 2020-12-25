/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Button } from '~/components/Button';
import { Frame } from '../Frame';
import { Player } from '../store';
import style from './index.module.scss';

export type WaitRoomProps = {
  quizName: string;
  pin: number;
  players: Player[];
  disabled: boolean;
  onStartClick: () => void;
};

export const WaitRoom: React.FC<WaitRoomProps> = (props) => {
  const { quizName, pin, players, disabled, onStartClick } = props;

  return (
    <div className={style.main}>
      <div className={style.title}>
        <div className={style.quizName}>
          <div className={style.quizNameHead}>Тема</div>
          <div className={style.quizNameText}>{quizName}</div>
        </div>
        <div className={style.quizPin}>
          <div className={style.quizPinHead}>ПИН-код игры</div>
          <div className={style.quizPinText}>{pin}</div>
        </div>
      </div>
      <div className={style.waitPlayers}>Ждём игроков...</div>
      <div className={style.waitPlayersContainer}>
        {players.map(({ nickname }, i) => (
          <Frame key={i} nickname={nickname} />
        ))}
      </div>
      <div className={style.buttonWrapper}>
        <Button color="white" disabled={disabled} onClick={onStartClick}>
          Начать викторину
        </Button>
      </div>
    </div>
  );
};
