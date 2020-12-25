import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { QuizCreatingPage } from '../QuizCreatingPage';
import { QuizzesPage } from '../QuizzesPage';

const quizzes = [
  {
    id: '000000',
    preview: 'https://instamag.ru/upload/medialibrary/6ea/006.jpg',
    title: 'Моя викторина 1',
    taskCount: 3,
  },
  {
    id: '000001',
    preview: 'https://instamag.ru/upload/medialibrary/6ea/006.jpg',
    title: 'Сложение дробей и целых чисел',
    taskCount: 20,
  },
  {
    id: '000002',
    preview: 'https://instamag.ru/upload/medialibrary/6ea/006.jpg',
    title: 'Моя викторина 2',
    taskCount: 1,
  },
];

export const TeacherApp: React.FC = () => {
  const handleCreateClick = React.useCallback(() => console.log('create click'), []);
  const handleStartClick = React.useCallback((id) => console.log('start click', id), []);
  const handleChangeClick = React.useCallback((id) => console.log('change click', id), []);

  return (
    <Switch>
      {/* <Route path="/teacher/quizzes" exact>
        <QuizzesPage
          locked={false}
          quizzes={quizzes}
          onCreateClick={handleCreateClick}
          onStartClick={handleStartClick}
          onChangeClick={handleChangeClick}
        />
      </Route>
      <Route path="/teacher/quiz/:id"> */}
      <QuizCreatingPage />
      {/* </Route> */}
    </Switch>
  );
};
