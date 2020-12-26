/* eslint-disable no-underscore-dangle */
import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useBodyClassName } from '~/shared/hooks/use-body-classname';
import style from './index.module.scss';
import { AppStore } from './store';
import { Preloader } from '../Preloader';
import { QuizzesPage } from '../QuizzesPage';
import { QuizCreatingPage } from '../QuizCreatingPage';
// import { QuizPlayPage } from '../QuizPlayPage';
import { QuizControlPageStore } from '../QuizControlPage/store';
import { QuizControlPage } from '../QuizControlPage';

const useRouting = (page: string) => {
  const history = useHistory();
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (mounted.current) history.push(page);
    else mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
};

export const App = observer(function App() {
  const store = useLocalObservable(() => new AppStore());

  React.useEffect(() => {
    store.fetchData();
    console.log(store);
  }, [store]);

  useRouting(store.page);
  useBodyClassName();

  return (
    <div className={style.main}>
      {store.loaded && (
        <Switch>
          <Route path="/teacher/quizzes" exact>
            <QuizzesPage
              locked={store.disabled}
              quizzes={store.teacherAppData}
              onCreateClick={store.handleQuizzesCreateClick}
              onStartClick={store.handleQuizzesStartClick}
              onChangeClick={store.handleQuizzesChangeClick}
            />
          </Route>
          <Route path="/teacher/quizzes/:id" exact>
            {({ match }) => {
              const pin = Number(match?.params.id);

              if (pin === null || pin === undefined) return null;
              const quiz = store.quizzes.find((q) => q.pin === pin)!;
              const items = store.getQuizCreatingPageItems(pin)!;

              return (
                <QuizCreatingPage
                  quiz={{ id: quiz._id, pin: quiz.pin, name: quiz.title, items }}
                  disabled={store.disabled}
                  onSaveClick={store.handleQuizSave}
                />
              );
            }}
          </Route>
          <Route path="/teacher/play/:pin" exact>
            {({ match }) => {
              const pin = Number(match?.params.pin);

              if (pin === null || pin === undefined) return null;

              return <QuizControlPage quiz={store.getQuizControlPageData(pin)!} />;
            }}
          </Route>
          <Route path="/pupil" exact>
            {/* <QuizPlayPage
              onSelectAnswerClick={store.handleSelectAnswer}
              onJoinQuizClick={store.handleJoinQuiz}
              getQuizData={store.getQuizData}
              getQuizCurrentState={store.getQuizCurrentState}
            /> */}
            <div>Pupil</div>
          </Route>
          <Route>Error</Route>
        </Switch>
      )}
      <Preloader shown={store.preloader.shown} visibility={store.preloader.visibility} />
    </div>
  );
});
