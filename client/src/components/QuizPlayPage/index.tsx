import { observer, useLocalObservable } from 'mobx-react';
import React from 'react';
import style from './index.module.scss';
import { Button } from '../Button';
import { Quiz, QuizPlayPageStore } from './store';

type QuizCurrentState = {
  quizActivated: boolean;
  currentQuestionIndex: number;
};

export type QuizPlayPageProps = {
  onSelectAnswerClick: (pin: number, quiestionId: number, selectedAnswer: number) => void;
  onJoinQuizClick: (nickName: string, pin: number) => void;
  getQuizData: (pin: number) => Promise<Quiz>;
  getQuizCurrentState: () => QuizCurrentState;
};

export const QuizPlayPage: React.FC<QuizPlayPageProps> = observer(function QuizPlayPage() {
  // const { onJoinQuizClick, getQuizData } = props;
  const store = useLocalObservable(() => new QuizPlayPageStore());
  const [inputPin, setInputPin] = React.useState(['']);
  // const setNickName = React.useCallback(
  //   async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { value } = e.currentTarget;
  //     store.setNickName(value);
  //     const quizData = await getQuizData(store.selectedPin);
  //     if (quizData) {
  //       store.setQuiz(quizData);
  //       onJoinQuizClick(store.nickName, quizData.pin);
  //     }
  //   },
  //   [store],
  // );
  const setQuizPin = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;
      inputPin.push(value);
      store.setSelectePin(Number(inputPin.join('')));
    },
    [store, inputPin],
  );

  const pinNumberItems = ['1', '1', '1', '1', '1', '1'].map((number, index) => (
    <input
      className={style.pinNumber}
      key={index}
      placeholder={number}
    />
  ));

  return (
    <div className={style.playQuizPage}>
      <div>{pinNumberItems}</div>
      <div className={style.buttonWrapper}>
    </div>
    </div>
  );
});
