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
      {!store.loading && (
        <Switch>
          <Route path="/teacher/quizzes" exact>
            <QuizzesPage
              locked={false}
              quizzes={store.teacherAppData}
              onCreateClick={store.handleQuizzesCreateClick}
              onStartClick={store.handleQuizzesStartClick}
              onChangeClick={store.handleQuizzesChangeClick}
            />
          </Route>
          <Route path="/teacher/quizzes/:id">
            {({ match }) => {
              const id = match?.params.id;

              if (id === null || id === undefined) return null;

              const quiz = store.quizzes.find((q) => q._id === id)!;
              const items = store.getQuizCreatingPageItems(id)!;

              return <QuizCreatingPage quiz={{ name: quiz.title, items }} />;
            }}
          </Route>
          <Route path="/student" exact>
            <div>Student Page</div>
          </Route>
          <Route>Error</Route>
        </Switch>
      )}
      <Preloader shown={store.loading} />
    </div>
  );
});
