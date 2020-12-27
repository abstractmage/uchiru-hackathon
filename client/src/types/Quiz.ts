import { Question } from './Question';

export type Quiz = {
  _id: string;
  pin: number;
  title: string;
  questions: Question[];
  preview: string;
};
