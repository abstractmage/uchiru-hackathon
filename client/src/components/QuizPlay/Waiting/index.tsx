import React from 'react';
import style from './index.module.scss';

export const Waiting = () => {
  return (
    <div className={style.main}>
      <div className={style.inner}>
        <div className={style.text}>Ожидание</div>
      </div>
    </div>
  );
};
