import { observer, useLocalObservable } from 'mobx-react';
import React from 'react';
import style from './index.module.scss';
import { Quiz, QuizControlPageStore } from './store';
import { Timer } from '../Timer';
import { Viewer } from './Viewer';
import { WaitRoom } from './WaitRoom';
import { Ladder } from '../QuizPlay/ResultPanel/Ladder';

export type QuizControlPageProps = {
  quiz: Quiz;
};

export const QuizControlPage: React.FC<QuizControlPageProps> = observer(function QuizControlPage(
  props,
) {
  const { quiz } = props;
  const store = useLocalObservable(() => new QuizControlPageStore());

  React.useEffect(() => {
    store.initQuiz(quiz);

    console.log(store);

    return store.disposeQuiz;
  }, [quiz, store]);

  return (
    store.quiz && (
      <div className={style.main}>
        {store.state === 'waiting' && (
          <WaitRoom
            quizName={store.quiz.title}
            pin={store.quiz.pin}
            players={store.players}
            disabled={!store.players.length}
            onStartClick={() => console.log(123)}
          />
        )}
        <Timer run={store.state === 'countdown'} onEnd={store.handleCountDownEnd} />
        <Viewer
          current={store.currentQuestion}
          questionShown={store.questionShown}
          questions={store.quiz.questions}
          onQuestionShown={store.handleQuestionShown}
          onQuestionHidden={store.handleQuestionHidden}
          onTimerEnd={store.handleTimerEnd}
          onButtonClick={store.handleButtonClick}
          result={store.currentQuestionResult}
        />
        {store.ladderData && (
          <Ladder
            shown={['entering', 'entered'].includes(store.ladderShownState)}
            onShowingEnd={store.handleLadderShowingEnd}
            players={store.ladderData}
          />
        )}
      </div>
    )
  );
});
