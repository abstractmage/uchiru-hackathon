import { makeAutoObservable } from 'mobx';
import { wait } from '~/shared/helpers/wait';

export type Question = {
  index: number;
  id: string;
  text: string;
  timer: number;
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
  state: 'waiting' | 'countdown' | 'progress' | 'results' = 'waiting';

  players: Player[] = [];

  lastQuestion: number | null = null;

  questionShown = false;

  currentQuestion: number | null = null;

  questionAnimation: null | 'entering' | 'entered' | 'exiting' = null;

  currentQuestionResult: { stats: number[]; right: number } | null = null;

  quiz: Quiz | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setState(value: 'waiting' | 'countdown' | 'progress' | 'results') {
    this.state = value;
  }

  setResult(result: { stats: number[]; right: number } | null) {
    this.currentQuestionResult = result;
  }

  initQuiz = (quiz: Quiz) => {
    this.quiz = quiz;
    console.warn('--- launch-quiz');
    console.warn('--- wait-for-pupil-join');
  };

  disposeQuiz = () => {
    console.log('quiz disposed');
  };

  addPlayer(nickname: string) {
    this.players = this.players.concat({ nickname });
  }

  startCountDown() {
    this.state = 'countdown';
  }

  async startProgress() {
    this.state = 'progress';
    console.warn('--- activate-quiz');

    await wait(500);

    this.showQuestion();
  }

  handleStartClick = () => {
    this.startCountDown();
  };

  handleCountDownEnd = () => {
    this.startProgress();
  };

  handleQuestionShown = () => {
    this.questionAnimation = 'entered';
  };

  handleQuestionHidden = () => {
    this.questionAnimation = null;
  };

  handleTimerEnd = () => {
    console.log('timer end');
  };

  handleButtonClick = () => {
    console.log('button click');
  };

  showQuestion() {
    console.warn('--- show-question');
    if (this.currentQuestion === null) {
      this.currentQuestion = 0;
    } else {
      this.currentQuestion += 1;
    }

    this.questionShown = true;
    this.questionAnimation = 'entering';
  }

  hideQuestion() {
    this.questionAnimation = 'exiting';
    this.questionShown = false;
  }
}
