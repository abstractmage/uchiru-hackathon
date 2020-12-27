import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';

export type TimerProps = {
  shown: boolean;
  onShowingEnd: () => void;
  value: number | null;
  onTimerEnd: () => void;
};

export const Timer: React.FC<TimerProps> = (props) => {
  const { shown, onShowingEnd, value, onTimerEnd } = props;
  const timerRef = React.useRef<HTMLDivElement>(null);

  return (
    <Transition
      nodeRef={timerRef}
      in={shown}
      timeout={200}
      onEnter={() => timerRef.current?.offsetHeight}
      onEntered={onShowingEnd}
    >
      {(state) => (
        <div ref={timerRef} className={cn(style.main, style[`main_${state}`])}>
          <div className={style.slot}>
            <div
              style={{
                animation: value ? `${style.rotateLeft} ${value}s linear forwards` : undefined,
              }}
              className={style.left}
              onAnimationEnd={onTimerEnd}
            />
          </div>
          <div className={style.slot}>
            <div
              style={{
                animation: value ? `${style.rotateRight} ${value}s linear forwards` : undefined,
              }}
              className={style.right}
            />
          </div>
        </div>
      )}
    </Transition>
  );
};
