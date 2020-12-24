import React from 'react';
import { Button } from '../../Button';
import style from './index.module.scss';

export type QuizCardProps = {
  preview?: string;
  title: string;
  taskCount: number;
  disabled?: boolean;
  onStartButtonClick?: () => void;
  onChangeButtonClick?: () => void;
};

const getTaskCountText = (taskCount: number) => {
  if (taskCount >= 10 && taskCount <= 20) return `${taskCount} вопросов`;

  const lastNumber = +taskCount.toString().slice(-1);

  if (lastNumber === 1) return `${taskCount} вопрос`;

  if (lastNumber >= 2 && lastNumber <= 4) return `${taskCount} вопроса`;

  return `${taskCount} вопросов`;
};

export const QuizCard: React.FC<QuizCardProps> = (props) => {
  const { preview, title, taskCount, disabled, onStartButtonClick, onChangeButtonClick } = props;

  return (
    <div className={style.main}>
      <div className={style.previewContainer}>
        <div className={style.preview} style={{ backgroundImage: preview }} />
      </div>
      <div className={style.contentContainer}>
        <div className={style.title}>
          <div className={style.titleInner}>{title}</div>
        </div>
        <div className={style.taskCount}>{getTaskCountText(taskCount)}</div>
        <div className={style.buttons}>
          <Button className={style.button} disabled={disabled} onClick={onStartButtonClick}>
            Запустить
          </Button>
          <Button
            className={style.button}
            color="purple"
            disabled={disabled}
            onClick={onChangeButtonClick}
          >
            Изменить
          </Button>
        </div>
      </div>
    </div>
  );
};
