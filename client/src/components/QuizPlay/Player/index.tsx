/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import { useFunction } from '~/shared/hooks/use-function';
import { Question as QuestionType } from '../store';
import style from './index.module.scss';
import { Question } from './Question';

export type PlayerProps = {
  shown?: boolean;
  onShowingEnd?: () => void;
  questionShown?: boolean;
  onQuestionShowingEnd?: () => void;
  current: number;
  questions: QuestionType[];
};

export const Player: React.FC<PlayerProps> = (props) => {
  const { shown, onShowingEnd, questionShown, onQuestionShowingEnd, current, questions } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const handleShowingEnd = useFunction(onShowingEnd);
  const handleQuestionShowingEnd = useFunction(onQuestionShowingEnd);

  return (
    <Transition
      nodeRef={ref}
      in={shown}
      timeout={500}
      onEnter={() => ref.current?.offsetHeight}
      onEntered={handleShowingEnd}
      onExited={handleShowingEnd}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          {questions.map((q, i) => (
            <Question
              key={i}
              data={{
                number: i + 1,
                time: q.timer,
                text: q.text,
                image: q.preview,
                answers: q.answers,
              }}
              shown={current === i && questionShown}
              onShowingEnd={handleQuestionShowingEnd}
            />
          ))}
        </div>
      )}
    </Transition>
  );
};
