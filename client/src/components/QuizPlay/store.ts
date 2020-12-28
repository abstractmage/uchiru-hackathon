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

type ShownState = 'entering' | 'entered' | 'exiting' | 'exited';

const getQuiz = async (pin: number): Promise<Quiz> => {
  const [result] = await Promise.all([Axios.get(`http://localhost:3001/quiz/${pin}`), wait(500)]);
  return result.data.quiz;
};

const annotations: AnnotationsMap<QuizPlayPageStore, never> = {
  quiz: observable,
  pin: observable,
  nickname: observable,
  pinPanelShownState: observable,
  nicknamePanelShownState: observable,
  playerShownState: observable,
  questionShownState: observable,
  timerRunning: observable,
  currentQuestion: observable,
  questionRunningState: observable,
  questionRightAnswer: observable,
  resultsShownState: observable,
  waitingStart: observable,
  results: observable,
  modalError: observable,

  handlePinPanelShowingEnd: action,
  handleNicknamePanelShowingEnd: action,
  handlePlayerShowingEnd: action,
  handleQuestionShowingEnd: action,
  handlePinEnterClick: action,
  handleTimerRunningEnd: action,
  handleNicknameBeginClick: action,
  handleQuestionRunningEnd: action,
  handleResultsShowingEnd: action,
  handleWebsocketMessage: action,
  handleModalErrorCloseClick: action,
  handleModalErrorShowingEnd: action,

  showModalError: action,
  hideModalError: action,
  setQuiz: action,
  fetchQuiz: action,
  clear: action,
};

export class QuizPlayPageStore extends Promiser {
  ws: WebSocket;

  quiz?: Quiz;

  pin?: number;

  nickname?: string;

  currentQuestion = 0;

  waitingStart = false;

  questionRunningState: 'init' | 'running' | 'finished' = 'init';

  pinPanelShownState: ShownState = 'entered';

  nicknamePanelShownState: ShownState = 'exited';

  playerShownState: ShownState = 'exited';

  questionShownState: ShownState = 'exited';

  timerRunning = false;

  questionRightAnswer: number | null = null;

  resultsShownState: ShownState = 'exited';

  results: {
    top: number;
    ladder: { nickname: string; score: [number, number] }[];
    score: [number, number];
  } | null = null;

  modalError: { shown: boolean; message: string | null } = { shown: false, message: null };

  constructor() {
    super();

    makeObservable(this, annotations);

    this.ws = new WebSocket('ws://localhost:3001');
    this.ws.onmessage = this.handleWebsocketMessage;
  }

  handleWebsocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    switch (data.eventName) {
      case 'pupil-join-fail':
        this.showModalError('Неверный ПИН-код викторины.');
        break;

      case 'pupil-join-success':
        this.setQuiz(data.quiz);
        this.waitingStart = true;
        break;

      case 'start-timer':
        this.waitingStart = false;
        this.timerRunning = true;
        break;

      case 'show-question':
        this.playerShownState = 'entering';
        this.questionShownState = 'entering';
        this.currentQuestion = data.index;
        break;

      case 'start-question':
        this.questionRunningState = 'running';
        break;

      case 'question-results':
        this.questionRightAnswer = data.rightAnswer;
        break;

      case 'hide-question':
        this.questionShownState = 'exiting';
        break;

      case 'finish':
        this.playerShownState = 'exiting';
        this.resultsShownState = 'entering';
        this.results = {
          top: data.top,
          ladder: data.ladder,
          score: data.score,
        };
        break;

      case 'teacher-exited':
        this.clear();
        this.showModalError('Учитель отключился');
        break;

      default:
        break;
    }
  };

  clear() {
    this.quiz = undefined;
    this.pin = undefined;
    this.nickname = undefined;
    this.currentQuestion = 0;
    this.waitingStart = false;
    this.questionRunningState = 'init';
    this.pinPanelShownState = 'exited';
    this.nicknamePanelShownState = 'exited';
    this.playerShownState = 'exited';
    this.questionShownState = 'exited';
    this.timerRunning = false;
    this.questionRightAnswer = null;
    this.resultsShownState = 'exited';
    this.results = null;
    this.modalError = { shown: false, message: null };
  }

  handleModalErrorCloseClick = () => {
    this.hideModalError();
  };

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
    console.log('Question showing end');
    if (this.questionShownState === 'entering') {
      this.questionShownState = 'entered';
      this.ws.send(JSON.stringify({ type: 'pupil', eventName: 'question-shown' }));
      return;
    }

    this.questionShownState = 'exited';
    this.questionRunningState = 'init';
    this.questionRightAnswer = null;
    this.ws.send(JSON.stringify({ type: 'pupil', eventName: 'question-hidden' }));
  };

  handlePinEnterClick = async (pin: number) => {
    this.pin = pin;

    this.pinPanelShownState = 'exiting';
    await this.setPromise(when(() => this.pinPanelShownState === 'exited'));

    this.nicknamePanelShownState = 'entering';
  };

  handleNicknameBeginClick = (nickname: string) => {
    this.nickname = nickname;
    this.nicknamePanelShownState = 'exiting';
    this.ws.send(
      JSON.stringify({
        type: 'pupil',
        eventName: 'pupil-join',
        pin: this.pin,
        nickname,
      }),
    );
  };

  handleTimerRunningEnd = () => {
    this.timerRunning = false;
    this.ws.send(JSON.stringify({ type: 'pupil', eventName: 'timer-end' }));
  };

  handleQuestionRunningEnd = (answer: number | null) => {
    this.questionRunningState = 'finished';
    this.ws.send(JSON.stringify({ type: 'pupil', eventName: 'timeout', answer }));
  };

  handleResultsShowingEnd = () => {
    if (this.resultsShownState === 'entering') {
      this.resultsShownState = 'entered';
      return;
    }

    this.resultsShownState = 'exited';
  };

  handleModalErrorShowingEnd = () => {
    if (!this.modalError.shown) {
      this.pinPanelShownState = 'entering';
    }
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
    await this.setPromise(when(() => this.nicknamePanelShownState === 'entered'));
  }

  showModalError(message: string) {
    this.modalError = { shown: true, message };
  }

  hideModalError() {
    this.modalError.shown = false;
  }

  cancel() {
    super.cancel();
    this.ws.close();
  }
}
