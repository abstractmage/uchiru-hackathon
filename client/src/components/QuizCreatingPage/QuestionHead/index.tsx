import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as TimerSVG } from './svg/Timer.svg';

export type QuestionHeadProps = {
  disabled?: boolean;
  nameValue?: string;
  timeValue?: string;
  onChangeName?: (name: string) => void;
  onChangeTime?: (time: string) => void;
};

export const QuestionHead: React.FC<QuestionHeadProps> = (props) => {
  const { disabled, nameValue, timeValue, onChangeName, onChangeTime } = props;

  const createInputChangeHandler = React.useCallback(
    (type: 'name' | 'time') => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;

        if (type === 'name' && disabled && onChangeName) onChangeName(value);

        if (type === 'time' && disabled && onChangeTime) onChangeTime(value);
      };
    },
    [disabled, onChangeName, onChangeTime],
  );

  return (
    <div className={cn(style.main, disabled && style.main_disabled)}>
      <div className={style.name}>
        <input
          className={style.input}
          type="text"
          placeholder="Введите вопрос..."
          onChange={createInputChangeHandler('name')}
          value={nameValue}
        />
      </div>
      <div className={style.time}>
        <div className={style.timer}>
          <TimerSVG />
        </div>
        <input
          className={style.input}
          type="text"
          onChange={createInputChangeHandler('time')}
          value={timeValue}
        />
      </div>
    </div>
  );
};
