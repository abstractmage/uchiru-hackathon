import React from 'react';
import _ from 'lodash';
import style from './index.module.scss';

export type StatsProps = {
  values: number[];
  onCalculated?: () => void;
};

const getHeights = (values: number[]) => {
  const max = Math.max(...values);
  const k = 100 / max;

  return values.map((v) => v * k);
};

export const Stats: React.FC<StatsProps> = (props) => {
  const { values, onCalculated } = props;
  const heights = getHeights(values);

  const handleCalculated = React.useCallback(() => {
    if (onCalculated) onCalculated();
  }, [onCalculated]);

  return (
    <div className={style.main} onTransitionEnd={handleCalculated}>
      {_.range(4).map((i) => (
        <div key={i} className={style.item}>
          <div style={{ height: `${heights[i]}%` }} className={style.itemInner}>
            <div className={style.itemText}>{values[i]}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
