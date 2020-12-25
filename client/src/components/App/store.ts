/* eslint-disable no-underscore-dangle */
import { makeAutoObservable } from 'mobx';
import Axios from 'axios';
import { Item } from '../QuizCreatingPage/store';
import { wait } from '~/shared/helpers/wait';

export type Question = {
  _id: string;
  answers: string[];
  rightAnswer: number;
  timeLimit: number;
  title: string;
};

export type Quiz = {
  _id: string;
  pin: number;
  title: string;
  questions: Question[];
};

export class AppStore {
  loaded = false;

  disabled = false;

  preloader = {
    shown: true,
    visibility: true,
  };

  page = window.location.pathname;

  quizzes: Quiz[] = [];

  get teacherAppData() {
    return this.quizzes.map((quiz) => ({
      // eslint-disable-next-line no-underscore-dangle
      id: quiz._id,
      preview: undefined,
      title: quiz.title,
      taskCount: quiz.questions.length,
    }));
  }

  constructor() {
    makeAutoObservable(this);
  }

  getQuizCreatingPageItems(id: string) {
    const quiz = this.quizzes.find((q) => q._id === id);

    if (!quiz) return null;

    return quiz.questions.map((question, index) => ({
      index,
      title: question.title,
      time: `${question.timeLimit}`,
      preview: undefined,
      variants: question.answers.map((a, i) => ({
        variant: `${i + 1}`,
        value: a,
        selected: question.rightAnswer === i,
      })),
    }));
  }

  getAvailablePin() {
    const pins = this.quizzes.map((q) => q.pin);
    const minPin = Math.min(...pins);
    let pin: number;

    do {
      pin = minPin + 1;
    } while (pins.includes(pin));

    return pin;
  }

  setPage(page: string) {
    this.page = page;
  }

  setLoadedData(quizzes: Quiz[]) {
    this.loaded = true;
    this.quizzes = quizzes;
    this.setPreloader(false, true);
  }

  fetchData() {
    Promise.all([Axios.get('http://localhost:3001/teacher'), wait(500)]).then(([{ data }]) => {
      const { quizess } = data;
      this.setLoadedData(quizess);
    });
  }

  setPreloader(shown: boolean, visibility: boolean) {
    this.preloader = { shown, visibility };
  }

  setDisabled(value: boolean) {
    this.disabled = value;
  }

  handleQuizzesCreateClick = async () => {
    this.disabled = true;
    this.setPreloader(true, false);

    const [res] = await Promise.all([
      Axios.post('http://localhost:3001/teacher/add', {
        pin: this.getAvailablePin(),
        title: 'Моя викторина',
        preview: '',
        questions: [
          {
            title: '',
            image: undefined,
            answers: ['', '', '', ''],
            rightAnswer: 0,
            timeLimit: 20,
          },
        ],
      }),
      wait(1000),
    ]);

    this.disabled = false;
    this.setPreloader(false, false);

    console.log(res);
  };

  handleQuizzesChangeClick = (id: string) => {
    this.setPage(`/teacher/quizzes/${id}`);
  };

  handleQuizzesStartClick = (id: string) => {
    this.setPage(`/teacher/control/${id}`);
  };

  handleQuizSave = ({
    id,
    pin,
    name,
    items,
  }: {
    id: string;
    pin: number;
    name: string;
    items: Item[];
  }) => {
    this.preloader = {
      shown: true,
      visibility: false,
    };

    const quiz = this.quizzes.find((q) => q._id === id);

    if (!quiz) return;

    quiz.title = name;
    quiz.questions = quiz.questions.map((q, i) => ({
      ...q,
      title: items[i].title,
      answers: items[i].variants.map((v) => v.value),
      rightAnswer: items[i].variants.findIndex((v) => v.selected),
      timeLimit: +items[i].time,
    }));

    Promise.all([
      Axios.post(`http://localhost:3001/teacher/edit/${pin}`, {
        pin,
        updated: {
          title: name,
          preview: items[0].preview || '',
          questions: items.map((item) => ({
            title: item.title,
            image: item.preview || '',
            answers: item.variants.map((v) => v.value),
            rightAnswer: item.variants.findIndex((v) => v.selected),
            timeLimit: +item.time,
          })),
        },
      }),
      wait(1000),
    ]).then(() => {
      this.setPreloader(true, false);
      this.setDisabled(false);
      this.setPage('/teacher/quizzes');
    });
  };
}
