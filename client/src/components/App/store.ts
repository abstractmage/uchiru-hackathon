/* eslint-disable no-underscore-dangle */
import { makeAutoObservable } from 'mobx';
import Axios from 'axios';
import { wait } from '~/shared/helpers/wait';
import { Item } from '../QuizCreatingPage/store';
import QuizEventsManager from '../../shared/helpers/eventsManager';
import { Quiz } from '~/types/Quiz';

type QuizCurrentState = {
  quizActivated: boolean;
  currentQuestionIndex: number;
};

export class AppStore {
  loaded = false;

  disabled = false;

  preloader = {
    shown: true,
    visibility: true,
  };

  hostUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

  baseApiUrl = process.env.NODE_ENV === 'development' ? '' : '/api/v1';

  page = window.location.pathname;

  quizzes: Quiz[] = [];

  quizEventsManager = new QuizEventsManager();

  get teacherAppData() {
    return this.quizzes.map((quiz) => ({
      // eslint-disable-next-line no-underscore-dangle
      id: quiz._id,
      pin: quiz.pin,
      preview: quiz.preview,
      title: quiz.title,
      taskCount: quiz.questions.length,
    }));
  }

  constructor() {
    makeAutoObservable(this);
  }

  getQuizCreatingPageItems(pin: number) {
    const quiz = this.quizzes.find((q) => q.pin === pin);

    if (!quiz) return null;

    return quiz.questions.map((question, index) => ({
      index,
      title: question.title,
      time: `${question.timeLimit}`,
      image: question.image,
      variants: question.answers.map((a, i) => ({
        variant: `${i + 1}`,
        value: a,
        selected: question.rightAnswer === i,
      })),
    }));
  }

  getAvailablePin(): number {
    const pins = this.quizzes.map((q) => q.pin);
    if (pins.length === 0) {
      return 1111;
    }
    const maxPin = Math.max(...pins);
    return maxPin + 1;
  }

  getQuizControlPageData(pin: number) {
    const quiz = this.quizzes.find((q) => q.pin === pin);

    if (!quiz) return null;

    return {
      id: quiz._id,
      pin: quiz.pin,
      title: quiz.title,
      questions: quiz.questions.map((q, i) => ({
        index: i,
        id: q._id,
        timer: q.timeLimit,
        text: q.title,
        preview: q.image || undefined,
        answers: q.answers,
      })),
    };
  }

  getQuizData = async (pin: number): Promise<Quiz> => {
    const [result] = await Promise.all([
      Axios.get(`${this.hostUrl}${this.baseApiUrl}/quiz/${pin}`),
      wait(500),
    ]);
    return result.data.quiz;
  };

  getQuizCurrentState(): QuizCurrentState {
    return {
      quizActivated: this.quizEventsManager.quizActivated,
      currentQuestionIndex: this.quizEventsManager.currentQuestionIndex,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getQuizRating(): any {
    return {
      quizRating: this.quizEventsManager.quizRating,
    };
  }

  setPage(page: string) {
    this.page = page;
  }

  setLoadedData(quizzes: Quiz[]) {
    this.loaded = true;
    this.quizzes = quizzes;
    this.setPreloader(false, true);
  }

  async fetchData() {
    await Promise.all([Axios.get(`${this.hostUrl}${this.baseApiUrl}/teacher`), wait(500)]).then(
      ([{ data }]) => {
        const { quizess } = data;
        this.setLoadedData(quizess);
      },
    );
  }

  setPreloader(shown: boolean, visibility: boolean) {
    this.preloader = { shown, visibility };
  }

  setDisabled(value: boolean) {
    this.disabled = value;
  }

  handleQuizzesCreateClick = async () => {
    this.setPage(`/teacher/quizzes/add`);
  };

  handleQuizzesChangeClick = (pin: number) => {
    this.setPage(`/teacher/quizzes/${pin}`);
  };

  handleQuizzesStartClick = (pin: number) => {
    this.quizEventsManager.init('teacher');
    this.quizEventsManager.launchQuiz(pin);
    this.setPage(`/teacher/play/${pin}`);
  };

  handleJoinQuiz = (nickName: string, pin: number) => {
    this.quizEventsManager.init(nickName);
    this.quizEventsManager.joinQuiz(nickName, pin);
  };

  handleSelectAnswer = (pin: number, quiestionId: number, selectedAnswer: number) => {
    this.quizEventsManager.selectAnswer(pin, quiestionId, selectedAnswer);
  };

  handleBackClick = () => {
    this.page = '/teacher/quizzes';
  };

  handleQuizSave = async ({
    id,
    pin,
    name,
    items,
  }: {
    id?: string;
    pin?: number;
    name: string;
    items: Item[];
  }) => {
    this.preloader = {
      shown: true,
      visibility: false,
    };

    if (id === undefined || pin === undefined) {
      await Promise.all([
        Axios.post(`${this.hostUrl}${this.baseApiUrl}/teacher/add`, {
          pin: this.getAvailablePin(),
          title: name,
          preview: items[0].image || '',
          questions: items.map((item) => ({
            title: item.title,
            image: item.image || '',
            answers: item.variants.map((v) => v.value),
            rightAnswer: item.variants.findIndex((v) => v.selected),
            timeLimit: +item.time,
          })),
        }),
        wait(1000),
      ]);
    } else {
      const quiz = this.quizzes.find((q) => q._id === id);

      if (!quiz) return;

      quiz.title = name;
      quiz.questions = items.map((item) => ({
        _id: '',
        title: item.title,
        answers: item.variants.map((v) => v.value),
        rightAnswer: item.variants.findIndex((v) => v.selected),
        timeLimit: +item.time,
        image: item.image || '',
      }));

      await Promise.all([
        Axios.post(
          `${this.hostUrl}${this.baseApiUrl}/teacher/edit/${pin}`,
          {
            pin,
            updated: {
              title: name,
              preview: items[0].image || '',
              questions: items.map((item) => ({
                title: item.title,
                image: item.image || '',
                answers: item.variants.map((v) => v.value),
                rightAnswer: item.variants.findIndex((v) => v.selected),
                timeLimit: +item.time,
              })),
            },
          },
          { headers: { 'Access-Control-Allow-Origin': '*' } },
        ),
        wait(1000),
      ]);
    }

    await this.fetchData();

    this.setPreloader(false, false);
    this.setDisabled(false);
    this.setPage('/teacher/quizzes');
  };
}
