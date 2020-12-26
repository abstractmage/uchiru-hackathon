/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import { Question } from '../store';
import style from './index.module.scss';
import { SelectButton } from '~/components/SelectButton';

export type ViewerProps = {
  current: number | null;
  questions: Question[];
  onQuestionShown: ((index: number) => void) | null;
  result: {
    stats: number[];
    right: number;
  } | null;
};

const colors: ('green' | 'blue' | 'orange' | 'purple')[] = ['green', 'blue', 'orange', 'purple'];

export const Viewer: React.FC<ViewerProps> = function Viewer(props) {
  const { current, questions, onQuestionShown, result } = props;
  const currentQuestionRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={style.main}>
      {questions.map((q, i) => (
        <Transition
          nodeRef={currentQuestionRef}
          key={i}
          in={current === q.index}
          onEnter={() => currentQuestionRef.current?.offsetHeight}
          timeout={500}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <div
              ref={currentQuestionRef}
              className={cn(style.question, style[`question_${state}`])}
            >
              {/* <div className={style.number}>{`Вопрос ${q.index + 1}`}</div> */}
              <div className={style.text}>{q.text}</div>
            </div>
          )}
        </Transition>
      ))}

      {/* <div className={cn(style.question)}>
        <div className={style.number}>{`Вопрос ${questions[current].index}`}</div>
        <div className={style.text}>{questions[current].text}</div>
        <Transition in={!!stats} timeout={2000}>
          {(state) =>
            stats!.map((s) => (
              <div className={style.stats}>
                <div className={style.statsItem} />
              </div>
            ))
          }
        </Transition>
        {questions[current].answers.map((answer, i) => (
          <div className={style.variant}>
            <SelectButton variant={`${i + 1}`} value={answer} color={colors[i]} />
          </div>
        ))}
      </div> */}
    </div>
  );
};
