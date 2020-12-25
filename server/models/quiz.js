
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizData = new Schema({});

module.exports = mongoose.model("Quiz", quizData);