/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import cn from 'classnames';
import { Question as QuestionType } from '../store';
import style from './index.module.scss';
import { Question } from './Question';
import { ReactComponent as ButtonSVG } from './svg/Button.svg';

export type ViewerProps = {
  current: number | null;
  questionShown: boolean;
  questions: QuestionType[];
  onButtonClick: () => void;
  onQuestionShown: () => void;
  onQuestionHidden: () => void;
  onTimerEnd: () => void;
  result: {
    stats: number[];
    right: number;
  } | null;
};

export const Viewer: React.FC<ViewerProps> = function Viewer(props) {
  const {
    current,
    questionShown,
    questions,
    onButtonClick,
    onQuestionHidden,
    onQuestionShown,
    onTimerEnd,
    result,
  } = props;

  return (
    <div className={style.main}>
      {questions.map((q, i) => (
        <Question
          key={i}
          shown={questionShown && current === i}
          onShowingEnd={onQuestionShown}
          onHidingEnd={onQuestionHidden}
          onTimerEnd={onTimerEnd}
          number={i + 1}
          text={q.text}
          image={q.preview}
          answers={q.answers}
          result={result}
          timer={q.timer}
        />
      ))}
      <div className={style.buttonContainer}>
        <div className={cn(style.button, result && style.button_shown)} onClick={onButtonClick}>
          <ButtonSVG />
        </div>
      </div>
    </div>
  );
};
