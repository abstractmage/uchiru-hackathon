import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useBodyClassName } from '~/shared/hooks/use-body-classname';
import style from './index.module.scss';
import { TeacherApp } from '../TeacherApp';
import { AppStore } from './store';
import { Preloader } from '../Preloader';

export const App = observer(function App() {
  const store = useLocalObservable(() => new AppStore());

  React.useEffect(() => console.log(store), [store]);

  useBodyClassName();

  return (
    <div className={style.main}>
      <BrowserRouter>
        <Switch>
          <Route path="/teacher">
            <TeacherApp />
          </Route>
          <Route path="/student" exact>
            <div>Student Page</div>
          </Route>
          <Route>Error</Route>
        </Switch>
      </BrowserRouter>
      <Preloader shown={store.loading} />
    </div>
  );
});
