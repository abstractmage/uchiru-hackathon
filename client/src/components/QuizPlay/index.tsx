import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import style from './index.module.scss';
import { PinPanel } from './PinPanel';
import { QuizPlayPageStore } from './store';
import { NicknamePanel } from './NicknamePanel';
import { Player } from './Player';
import { Timer } from '../Timer';
import { ResultPanel } from './ResultPanel';
import { ModalError } from '../ModalError';
import { Waiting } from './Waiting';

export const QuizPlayPage: React.FC = observer(function QuizPlayPage() {
  const store = useLocalObservable(() => new QuizPlayPageStore());

  React.useEffect(() => {
    console.log(store);
    return store.cancel;
  }, [store]);

  return (
    <div className={style.main}>
      <PinPanel
        shown={['entered', 'entering'].includes(store.pinPanelShownState)}
        onShowingEnd={store.handlePinPanelShowingEnd}
        onEnterClick={store.handlePinEnterClick}
      />
      <NicknamePanel
        shown={['entered', 'entering'].includes(store.nicknamePanelShownState)}
        onShowingEnd={store.handleNicknamePanelShowingEnd}
        onBeginClick={store.handleNicknameBeginClick}
      />
      {store.quiz && (
        <Player
          shown={['entered', 'entering'].includes(store.playerShownState)}
          onShowingEnd={store.handlePlayerShowingEnd}
          questionShown={['entered', 'entering'].includes(store.questionShownState)}
          onQuestionShowingEnd={store.handleQuestionShowingEnd}
          current={store.currentQuestion}
          questions={store.quiz.questions}
          questionRunningState={store.questionRunningState}
          onQuestionRunningEnd={store.handleQuestionRunningEnd}
          questionRightAnswer={store.questionRightAnswer}
        />
      )}
      <Timer run={store.timerRunning} onEnd={store.handleTimerRunningEnd} />
      <ResultPanel
        shown={['entered', 'entering'].includes(store.resultsShownState)}
        onShowingEnd={store.handleResultsShowingEnd}
        results={store.results}
      />
      {store.waitingStart && <Waiting />}
      <ModalError
        shown={store.modalError.shown}
        message={store.modalError.message || undefined}
        onCloseClick={store.handleModalErrorCloseClick}
        onShowingEnd={store.handleModalErrorShowingEnd}
      />
    </div>
  );
});
