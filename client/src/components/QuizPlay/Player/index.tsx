/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import { useFunction } from '~/shared/hooks/use-function';
import { Question as QuestionType } from '~/types/Question';
import style from './index.module.scss';
import { Question } from './Question';

export type PlayerProps = {
  shown?: boolean;
  onShowingEnd?: () => void;
  questionShown?: boolean;
  onQuestionShowingEnd?: () => void;
  questionRunningState?: 'init' | 'running' | 'finished';
  onQuestionRunningEnd?: (answer: number | null) => void;
  current: number;
  questions: QuestionType[];
  questionRightAnswer?: number | null;
};

export const Player: React.FC<PlayerProps> = (props) => {
  const {
    shown,
    onShowingEnd,
    questionShown,
    onQuestionShowingEnd,
    current,
    questions,
    questionRunningState,
    onQuestionRunningEnd,
    questionRightAnswer,
  } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const handleShowingEnd = useFunction(onShowingEnd);
  const handleQuestionShowingEnd = useFunction(onQuestionShowingEnd);

  const handleQuestionRunningEnd = React.useCallback(
    (answer: number | null) => {
      if (onQuestionRunningEnd) onQuestionRunningEnd(answer);
    },
    [onQuestionRunningEnd],
  );

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
                time: q.timeLimit,
                text: q.title,
                image: q.image,
                answers: q.answers,
              }}
              shown={current === i && questionShown}
              onShowingEnd={handleQuestionShowingEnd}
              runningState={questionRunningState}
              onRunningEnd={handleQuestionRunningEnd}
              rightAnswer={questionRightAnswer}
            />
          ))}
        </div>
      )}
    </Transition>
  );
};
