
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  img: {data: Buffer, required: false, contentType: String},
  title: { type: String, required: true, max: 200},
  answers: {type: Array, required: true },
  rightAnswer: {type: Number, required: true },
  timeLimit: { type: Number, required: true } ,
});

const quizData = new Schema({
  pin: { type: Number, required: true },
  img: {data: Buffer, required: false, contentType: String},
  title: { type: String, required: true, max: 200},
  questions: [questionSchema],
});

const Quiz = mongoose.model("Quiz", quizData);

module.exports = Quiz;