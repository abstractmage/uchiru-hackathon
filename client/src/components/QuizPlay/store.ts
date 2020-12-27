import Axios from 'axios';
import { action, AnnotationsMap, makeObservable, observable, when } from 'mobx';
import { Promiser } from '~/shared/helpers/Promiser';
import { wait } from '~/shared/helpers/wait';
import { Quiz } from '~/types/Quiz';

export type Question = {
  index: number;
  id: string;
  text: string;
  timer: number;
  preview?: string;
  answers: string[];
};

const getQuiz = async (pin: number): Promise<Quiz> => {
  const [result] = await Promise.all([Axios.get(`http://localhost:3001/quiz/${pin}`), wait(500)]);
  return result.data.quiz;
};

const annotations: AnnotationsMap<QuizPlayPageStore, never> = {
  quiz: observable,
  nickname: observable,
  pinPanelShownState: observable,
  nicknamePanelShownState: observable,
  playerShownState: observable,
  questionShownState: observable,
  timerRunning: observable,

  handlePinPanelShowingEnd: action,
  handleNicknamePanelShowingEnd: action,
  handlePlayerShowingEnd: action,
  handleQuestionShowingEnd: action,
  handlePinEnterClick: action,
  handleTimerRunningEnd: action,
  handleNicknameBeginClick: action,

  setQuiz: action,
  fetchQuiz: action,
};

export class QuizPlayPageStore extends Promiser {
  quiz?: Quiz;

  nickname?: string;

  pinPanelShownState: 'entering' | 'entered' | 'exiting' | 'exited' = 'entered';

  nicknamePanelShownState: 'entering' | 'entered' | 'exiting' | 'exited' = 'exited';

  playerShownState: 'entering' | 'entered' | 'exiting' | 'exited' = 'exited';

  questionShownState: 'entering' | 'entered' | 'exiting' | 'exited' = 'exited';

  timerRunning = false;

  constructor() {
    super();

    makeObservable(this, annotations);
  }

  handlePinPanelShowingEnd = () => {
    if (this.pinPanelShownState === 'entering') {
      this.pinPanelShownState = 'entered';
      return;
    }

    this.pinPanelShownState = 'exited';
  };

  handleNicknamePanelShowingEnd = () => {
    if (this.nicknamePanelShownState === 'entering') {
      this.nicknamePanelShownState = 'entered';
      return;
    }

    this.nicknamePanelShownState = 'exited';
  };

  handlePlayerShowingEnd = () => {
    if (this.playerShownState === 'entering') {
      this.playerShownState = 'entered';
      return;
    }

    this.playerShownState = 'exited';
  };

  handleQuestionShowingEnd = () => {
    if (this.questionShownState === 'entering') {
      this.questionShownState = 'entered';
      return;
    }

    this.questionShownState = 'exited';
  };

  handlePinEnterClick = (pin: number) => {
    this.fetchQuiz(pin);
  };

  handleNicknameBeginClick = (nickname: string) => {
    this.nickname = nickname;
  };

  handleTimerRunningEnd = () => {
    this.timerRunning = false;
  };

  setQuiz(quiz: Quiz) {
    this.quiz = quiz;
  }

  async fetchQuiz(pin: number) {
    getQuiz(pin).then((quiz) => this.setQuiz(quiz));

    await this.setPromise(when(() => !!this.quiz));

    this.pinPanelShownState = 'exiting';
    await this.setPromise(when(() => this.pinPanelShownState === 'exited'));

    this.nicknamePanelShownState = 'entering';
    await this.setPromise(when(() => this.nicknamePanelShownState === 'exited'));
  }
}
