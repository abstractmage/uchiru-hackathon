const express = require('express');
const router = express.Router();
const controllers =require('../controllers/controllers');

const getRouter = (collection) => {
  const dbControllers = controllers.controllers(collection);
  router.get('/teacher', dbControllers.getAllQuizess);
  router.get('/quiz/:quizId', dbControllers.getQuiz);
  router.post('/teacher/edit/:quizId', dbControllers.updateQuiz);
  router.post('/teacher/add', dbControllers.addQuiz);
  return router;
};

module.exports = {
  getRouter
};

