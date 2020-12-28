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

  setQuiz: action,
  fetchQuiz: action,
};

export class QuizPlayPageStore extends Promiser {
  ws: WebSocket;

  quiz?: Quiz;

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

  constructor() {
    super();

    makeObservable(this, annotations);

    this.ws = new WebSocket('ws://localhost:3001');
    this.ws.onmessage = this.handleWebsocketMessage;
  }

  handleWebsocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    switch (data.eventName) {
      case 'start-timer':
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

      default:
        break;
    }
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

  handlePinEnterClick = (pin: number) => {
    this.fetchQuiz(pin);
  };

  handleNicknameBeginClick = (nickname: string) => {
    this.nickname = nickname;
    this.nicknamePanelShownState = 'exiting';
    this.ws.send(
      JSON.stringify({ type: 'pupil', eventName: 'pupil-join', nickname, pin: this.quiz?.pin }),
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

  cancel() {
    super.cancel();
    this.ws.close();
  }
}
