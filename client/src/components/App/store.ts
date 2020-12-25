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

  setPage(page: string) {
    this.page = page;
  }

  setLoadedData(quizzes: Quiz[]) {
    this.loaded = true;
    this.quizzes = quizzes;
    this.preloader = {
      shown: false,
      visibility: false,
    };
  }

  fetchData() {
    Promise.all([Axios.get('http://localhost:3001/teacher'), wait(500)]).then(([{ data }]) => {
      const { quizess } = data;
      this.setLoadedData(quizess);
    });
  }

  handleQuizzesCreateClick = () => {
    // this.setPage('/teacher/quizzez');
  };

  handleQuizzesChangeClick = (id: string) => {
    this.setPage(`/teacher/quizzes/${id}`);
  };

  handleQuizzesStartClick = (id: string) => {
    this.setPage(`/teacher/control/${id}`);
  };

  handleQuizSave = (params: { name: string; items: Item[] }) => {
    console.log(params);
  };
}
