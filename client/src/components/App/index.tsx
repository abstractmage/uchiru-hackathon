import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useBodyClassName } from '~/shared/hooks/use-body-classname';
import style from './index.module.scss';
import { TeacherApp } from '../TeacherApp';

export const App = () => {
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
    </div>
  );
};
