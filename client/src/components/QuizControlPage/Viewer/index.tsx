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
  questions: QuestionType[];
  onButtonClick?: () => void;
  onQuestionShown: ((index: number) => void) | null;
  onQuestionHidden: ((index: number) => void) | null;
  result: {
    stats: number[];
    right: number;
  } | null;
};

export const Viewer: React.FC<ViewerProps> = function Viewer(props) {
  const { current, questions, onQuestionShown, onButtonClick, result } = props;

  const handleQuestionShown = React.useCallback(() => console.log('question shown'), []);
  const handleQuestionHidden = React.useCallback(() => console.log('question hidden'), []);

  return (
    <div className={style.main}>
      {questions.map((q, i) => (
        <Question
          key={i}
          shown={current === i}
          onShowingEnd={handleQuestionShown}
          onHidingEnd={handleQuestionHidden}
          number={i + 1}
          text={q.text}
          image={q.preview}
          answers={q.answers}
          result={result}
        />
      ))}
      <div className={style.buttonContainer}>
        <div className={cn(style.button, result && style.button_shown)}>
          <ButtonSVG />
        </div>
      </div>
    </div>
  );
};
