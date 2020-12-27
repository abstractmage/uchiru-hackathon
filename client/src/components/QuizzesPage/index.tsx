import React from 'react';
import { QuizCard } from './QuizCard';
import { CreateButton } from './CreateButton';
import style from './index.module.scss';

export type Quiz = {
  id: string;
  pin: number;
  preview?: string;
  title: string;
  taskCount: number;
};

export type QuizzesPageProps = {
  locked: boolean;
  quizzes: Quiz[];
  onCreateClick: () => void;
  onStartClick: (pin: number) => void;
  onChangeClick: (pin: number) => void;
};

export const QuizzesPage: React.FC<QuizzesPageProps> = (props) => {
  const { locked, quizzes, onChangeClick, onCreateClick, onStartClick } = props;

  const createStartClickHandler = React.useCallback(
    (pin: number) => {
      return () => onStartClick(pin);
    },
    [onStartClick],
  );

  const createChangeClickHandler = React.useCallback(
    (pin: number) => {
      return () => onChangeClick(pin);
    },
    [onChangeClick],
  );

  return (
    <div className={style.main}>
      <div className={style.container}>
        <div className={style.containerInner}>
          <div className={style.grid}>
            {quizzes.map((quiz) => (
              <div key={quiz.id} className={style.item}>
                <QuizCard
                  title={quiz.title}
                  taskCount={quiz.taskCount}
                  preview={quiz.preview}
                  disabled={locked}
                  onStartButtonClick={createStartClickHandler(quiz.pin)}
                  onChangeButtonClick={createChangeClickHandler(quiz.pin)}
                />
              </div>
            ))}
            <div className={style.item}>
              <CreateButton disabled={locked} onClick={onCreateClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
