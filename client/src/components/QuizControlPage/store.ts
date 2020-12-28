import { makeAutoObservable } from 'mobx';

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
  ws: WebSocket;

  state: 'waiting' | 'countdown' | 'progress' | 'results' = 'waiting';

  players: Player[] = [];

  questionShown = false;

  currentQuestion: number | null = null;

  questionRunning = false;

  questionAnimation: null | 'entering' | 'entered' | 'exiting' = null;

  currentQuestionResult: { stats: number[]; right: number } | null = null;

  quiz: Quiz | null = null;

  ladderData: { nickname: string; score: [number, number] }[] | null = null;

  ladderShownState: 'entering' | 'entered' | 'exiting' | 'exited' = 'exited';

  constructor() {
    makeAutoObservable(this);

    this.ws = new WebSocket('ws://localhost:3001');
    this.ws.onmessage = this.handleWebsocketMessage;
  }

  handleWebsocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    switch (data.eventName) {
      case 'pupil-join':
        this.addPlayer(data.nickname);
        break;

      case 'start-timer':
        this.startCountDown();
        break;

      case 'show-question':
        this.showQuestion(data.index);
        break;

      case 'start-question':
        this.questionRunning = true;
        break;

      case 'question-results':
        this.currentQuestionResult = { stats: data.stats, right: data.rightAnswer };
        break;

      case 'hide-question':
        this.hideQuestion();
        break;

      case 'finish':
        this.ladderShownState = 'entering';
        this.ladderData = data.ladder;
        break;

      default:
        break;
    }
  };

  setState(value: 'waiting' | 'countdown' | 'progress' | 'results') {
    this.state = value;
  }

  setResult(result: { stats: number[]; right: number } | null) {
    this.currentQuestionResult = result;
  }

  initQuiz = (quiz: Quiz) => {
    this.quiz = quiz;

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          eventName: 'wait-for-pupils',
          type: 'teacher',
          pin: quiz.pin,
        }),
      );
    };
  };

  disposeQuiz = () => {
    this.ws.close();
  };

  addPlayer(nickname: string) {
    this.players = this.players.concat({ nickname });
  }

  startCountDown() {
    this.state = 'countdown';
  }

  startProgress() {
    this.state = 'progress';
  }

  handleStartClick = () => {
    this.ws.send(JSON.stringify({ type: 'teacher', eventName: 'launch-quiz' }));
  };

  handleCountDownEnd = () => {
    this.startProgress();
    this.ws.send(JSON.stringify({ eventName: 'timer-end', type: 'teacher' }));
  };

  handleQuestionShown = () => {
    this.questionAnimation = 'entered';
    this.ws.send(JSON.stringify({ type: 'teacher', eventName: 'question-shown' }));
  };

  handleQuestionHidden = () => {
    this.questionAnimation = null;
    this.currentQuestionResult = null;
    this.questionRunning = false;
    this.ws.send(JSON.stringify({ type: 'teacher', eventName: 'question-hidden' }));
  };

  handleTimerEnd = () => {
    this.ws.send(JSON.stringify({ type: 'teacher', eventName: 'timeout' }));
  };

  handleButtonClick = () => {
    this.ws.send(JSON.stringify({ type: 'teacher', eventName: 'finish-question' }));
  };

  handleLadderShowingEnd = () => {
    if (this.ladderShownState === 'entering') {
      this.ladderShownState = 'entered';
      return;
    }

    this.ladderShownState = 'exited';
  };

  showQuestion(index?: number) {
    if (index !== undefined) {
      this.currentQuestion = index;
    }

    if (index === undefined && this.currentQuestion === null) {
      this.currentQuestion = 0;
    }

    if (index === undefined && this.currentQuestion !== null) {
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
