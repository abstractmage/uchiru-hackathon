import { action, makeAutoObservable } from 'mobx';

export type Question = {
  _id: string;
  answers: string[];
  rightAnswer: number;
  timeLimit: number;
  title: string;
  image: string;
};

export type Quiz = {
  _id: string;
  pin: number;
  title: string;
  questions: Question[];
  preview: string;
};


export class QuizPlayPageStore {

  quiz: Quiz | null = null;
  quizLoaded = false;
  selectedPin = 0;
  nickName: string = '';

  constructor() {
    makeAutoObservable(this, {
      setQuiz: action,
      setSelectePin: action,
      setNickName: action,
    });
  }

  setQuiz(quiz: Quiz) {
    this.quiz = quiz;
    this.quizLoaded = true;
  }

  setSelectePin(pin: number) {
    this.selectedPin = pin;
    console.log(this.selectedPin);
  }

  setNickName(nickName: string) {
    this.nickName = nickName;
  }
}