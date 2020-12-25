import { makeAutoObservable } from 'mobx';

export type Question = {
  index: number;
  id: string;
  text: string;
  preview?: string;
  answers: string[];
};

export type Quiz = {
  id: string;
  pin: number;
  title: string;
  questions: Question[];
};

export type Player = {
  nickname: string;
};

export class QuizControlPageStore {
  state: 'waiting' | 'countdown' | 'progress' | 'final' = 'waiting';

  players: Player[] = [];

  currentQuestion = 0;

  quiz: Quiz | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  initQuiz = (quiz: Quiz) => {
    this.quiz = quiz;
    console.log('quiz initialized');
  };

  disposeQuiz = () => {
    console.log('quiz disposed');
  };

  handleStartClick = () => {
    this.state = 'countdown';
  };

  handleCountDownEnd = () => {
    this.state = 'progress';
  };
}
