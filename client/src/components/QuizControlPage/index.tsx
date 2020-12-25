import React from 'react';

type Player = {
  nickname: string;
};

export type QuizControlPageProps = {
  quizName: string;
  quizPin: string;
  players: Player[];
};

export const QuizControlPage: React.FC<QuizControlPageProps> = (props) => {
  return null;
};
