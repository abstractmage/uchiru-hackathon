/* eslint-disable consistent-return */
import React from 'react';
import style from './index.module.scss';

export type TimerProps = {
  run: boolean;
  onEnd: () => void;
};

const useTimer = ({ run, onEnd }: { run: boolean; onEnd: () => void }) => {
  const [second, setSecond] = React.useState(3);

  React.useEffect(() => {
    if (run) {
      const interval = setInterval(() => setSecond((v) => v - 1), 1000);

      return () => {
        clearInterval(interval);
        setSecond(3);
      };
    }
  }, [onEnd, run]);

  React.useEffect(() => {
    if (second === -1) {
      onEnd();
    }
  }, [onEnd, second]);

  return second;
};

export const Timer: React.FC<TimerProps> = (props) => {
  const { run, onEnd } = props;
  const second = useTimer({ run, onEnd });

  return run ? (
    <div style={{ display: second < 0 ? 'none' : 'auto' }} className={style.main}>
      <div className={style.inner}>
        <div className={style.text}>Викторина начнётся через</div>
        <div className={style.second}>{second}</div>
      </div>
    </div>
  ) : null;
};
