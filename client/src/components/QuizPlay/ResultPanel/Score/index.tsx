/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';
import { Button } from '~/components/Button';

export type ScoreProps = {
  shown?: boolean;
  top: number;
  score: [number, number];
  onLadderButtonClick?: () => void;
};

export const Score: React.FC<ScoreProps> = (props) => {
  const { shown, top, score, onLadderButtonClick } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Transition
      nodeRef={ref}
      in={shown}
      timeout={500}
      onEnter={() => ref.current?.offsetHeight}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          {top === 1 ? (
            <div className={style.inner}>
              <div className={style.trophy}>🏆</div>
              <div className={style.firstPlace}>1 место!</div>
              <div className={style.scores}>{`${score[0]} из ${score[1]} верно`}</div>
              <div className={style.buttonWrapper}>
                <Button className={style.button} color="white" onClick={onLadderButtonClick}>
                  Таблица лидеров
                </Button>
              </div>
            </div>
          ) : (
            <div className={style.inner}>
              <div className={style.trophy}>🤩</div>
              <div className={style.goodJob}>Хорошая работа!</div>
              <div className={style.scores}>{`${score[0]} из ${score[1]} верно`}</div>
              <div className={style.buttonWrapper}>
                <Button className={style.button} color="white" onClick={onLadderButtonClick}>
                  Таблица лидеров
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Transition>
  );
};
