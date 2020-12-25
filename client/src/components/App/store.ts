/* eslint-disable no-underscore-dangle */
import { makeAutoObservable } from 'mobx';
import Axios from 'axios';
import { wait } from '~/shared/helpers/wait';
import { Item } from '../QuizCreatingPage/store';

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
      pin: quiz.pin,
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
        text: q.title,
        preview: undefined,
        answers: q.answers,
      })),
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
  };

  handleQuizzesChangeClick = (pin: number) => {
    this.setPage(`/teacher/quizzes/${pin}`);
  };

  handleQuizzesStartClick = (pin: number) => {
    this.setPage(`/teacher/control/${pin}`);
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
      this.setPreloader(false, false);
      this.setDisabled(false);
      this.setPage('/teacher/quizzes');
    });
  };
}

// axios.get('http://localhost:3001/teacher').then((res) => {
//   const { quizess } = res.data;
//   console.log('ALL QUIZESS', quizess);
// });

// axios.post('http://localhost:3001/teacher/edit/1111', {
//   pin: 1111,
//   updated: {
//     title: 'UPDATED TITLE',
//   },
// });

// axios.get('http://localhost:3001/quiz/1111').then((res) => {
//   const { quiz } = res.data;
//   console.log('SINGLE QUIZ', quiz);
// });
