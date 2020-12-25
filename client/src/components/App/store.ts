/* eslint-disable no-underscore-dangle */
import { makeAutoObservable } from 'mobx';
import Axios from 'axios';

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
  loading = true;

  page = '/teacher/quizzes';

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
    this.quizzes = quizzes;
    this.loading = false;
  }

  fetchData() {
    Axios.get('http://localhost:3001/teacher').then((res) => {
      const { quizess } = res.data;
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
}
