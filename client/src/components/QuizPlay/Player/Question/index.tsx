/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import { SelectButton } from '~/components/SelectButton';
import { useFunction } from '~/shared/hooks/use-function';
import style from './index.module.scss';

export type QuestionProps = {
  data: {
    number: number;
    time: number;
    text: string;
    image?: string;
    answers: string[];
  };
  shown?: boolean;
  onShowingEnd?: () => void;
  runningState?: 'init' | 'running' | 'finished';
  onRunningEnd?: (answer: number | null) => void;
  rightAnswer?: number | null;
};

const colors = ['green', 'blue', 'orange', 'purple'] as ('green' | 'blue' | 'orange' | 'purple')[];

export const Question: React.FC<QuestionProps> = (props) => {
  const { data, shown, onShowingEnd, rightAnswer, runningState, onRunningEnd } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [selected, setSelected] = React.useState<null | number>(null);
  const handleShowingEnd = useFunction(onShowingEnd);

  const createHandleSelect = React.useCallback((i: number) => {
    return () => setSelected(i);
  }, []);

  const handleRunEnd = React.useCallback(() => {
    if (onRunningEnd) onRunningEnd(selected);
  }, [onRunningEnd, selected]);

  return (
    <Transition
      nodeRef={ref}
      in={shown}
      timeout={500}
      onEnter={() => ref.current?.offsetHeight}
      onEntered={handleShowingEnd}
      onExited={handleShowingEnd}
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          <div
            className={style.time}
            style={{
              width: ['running', 'finished'].includes(runningState!) ? 0 : undefined,
              transition: runningState === 'running' ? `width ${data.time}s linear` : undefined,
            }}
            onTransitionEnd={handleRunEnd}
          />
          <div className={style.inner}>
            <div className={style.text}>
              <div className={style.number}>{data.number}</div>
              <div className={style.textInner}>{data.text}</div>
            </div>
            {data.image && (
              <div className={style.image} style={{ backgroundImage: `url(${data.image})` }} />
            )}
            <div className={style.answers}>
              {data.answers.map((a, i) => (
                <div
                  key={i}
                  className={cn(
                    style.answer,
                    runningState === 'running' && style.answer_clickable,
                    {
                      [style.answer_blurred]: selected !== null && selected !== i,
                      [style.answer_right]: rightAnswer !== null && rightAnswer === i,
                      [style.answer_wrong]:
                        rightAnswer !== null && rightAnswer !== i && selected === i,
                    },
                  )}
                >
                  <SelectButton
                    classNames={{
                      main: style.answerMain,
                      variant: style.answerVariant,
                      content: style.answerContent,
                      contentInner: style.answerContentInner,
                    }}
                    variant={`${i + 1}`}
                    value={a}
                    color={colors[i]}
                    onClick={createHandleSelect(i)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};
