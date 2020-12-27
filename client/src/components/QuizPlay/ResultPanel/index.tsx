import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';
import { useFunction } from '~/shared/hooks/use-function';
import { Score } from './Score';
import { Ladder } from './Ladder';

export type ResultPanelProps = {
  shown?: boolean;
  onShowingEnd?: () => void;
  results: {
    top: number;
    ladder: { nickname: string; score: [number, number] }[];
    score: [number, number];
  } | null;
};

export const ResultPanel: React.FC<ResultPanelProps> = (props) => {
  const { shown, onShowingEnd, results } = props;
  const [resultPage, setResultPage] = React.useState<'score' | 'ladder'>('score');
  const ref = React.useRef<HTMLDivElement>(null);
  const handleShowingEnd = useFunction(onShowingEnd);

  const handleLadderButtonClick = React.useCallback(() => {
    setResultPage('ladder');
  }, []);

  const handleScoreButtonClick = React.useCallback(() => {
    setResultPage('score');
  }, []);

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
          {results && (
            <>
              <Score
                shown={resultPage === 'score'}
                top={results.top}
                score={results.score}
                onLadderButtonClick={handleLadderButtonClick}
              />
              <Ladder
                shown={resultPage === 'ladder'}
                players={results.ladder}
                onScoreButtonClick={handleScoreButtonClick}
              />
            </>
          )}
        </div>
      )}
    </Transition>
  );
};
