import React from 'react';
import style from './index.module.scss';

export type FrameProps = {
  nickname: string;
};

export const Frame: React.FC<FrameProps> = (props) => {
  const { nickname } = props;

  return <div className={style.main}>{nickname}</div>;
};
