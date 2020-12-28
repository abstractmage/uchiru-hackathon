/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import Scrollbars from 'react-custom-scrollbars';
import style from './index.module.scss';
import { Button } from '~/components/Button';

export type LadderProps = {
  shown?: boolean;
  players: { nickname: string; score: [number, number] }[];
  onScoreButtonClick?: () => void;
  onShowingEnd?: () => void;
};

const getPlayersProgress = (score: number[]) => {
  const max = Math.max(...score);
  const k = 100 / max;

  return score.map((v) => v * k);
};

const usePlayersProgress = (players: { nickname: string; score: [number, number] }[]) => {
  const [progress, setProgress] = React.useState(
    getPlayersProgress(players.map((p) => p.score[0])),
  );

  React.useEffect(() => {
    setProgress(getPlayersProgress(players.map((p) => p.score[0])));
  }, [players]);

  return progress;
};

export const Ladder: React.FC<LadderProps> = (props) => {
  const { shown, players, onScoreButtonClick, onShowingEnd } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const playersProgress = usePlayersProgress(players);

  return (
    <Transition
      nodeRef={ref}
      in={shown}
      timeout={500}
      onEnter={() => ref.current?.offsetHeight}
      onEntered={onShowingEnd}
      onExited={onShowingEnd}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          <div className={style.inner}>
            <div className={style.ladder}>
              <div className={style.ladderTitle}>Таблица лидеров</div>
              <div className={style.ladderContent}>
                <div className={style.ladderContentInner}>
                  <Scrollbars>
                    {players.map((p, i) => (
                      <div key={i} className={style.ladderItem}>
                        <div className={style.ladderItemNickname}>{p.nickname}</div>
                        <div className={style.ladderItemScore}>{p.score[0]}</div>
                        <div
                          className={style.ladderItemProgress}
                          style={{ width: `${playersProgress[i]}%` }}
                        />
                      </div>
                    ))}
                  </Scrollbars>
                </div>
              </div>
            </div>
          </div>
          <div className={style.buttonWrapper}>
            <Button className={style.button} color="white" onClick={onScoreButtonClick}>
              Назад
            </Button>
          </div>
        </div>
      )}
    </Transition>
  );
};
