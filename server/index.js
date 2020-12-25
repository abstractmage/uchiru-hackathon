require('dotenv').config();
const app = require('./app');
const http = require('http');
const server = http.createServer(app);


const quizzes = [
  {
    pin: 1111,
    title: 'Quiz 1',
    questions: [
      {
        title: 'Question 1',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 1,
      },
      {
        title: 'Question 2',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 0,
      }
    ],
  },
  {
    pin: 2222,
    title: 'Quiz 2',
    questions: [
      {
        title: 'Question 1',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 1,
      },
      {
        title: 'Question 2',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 0,
      }
    ],
  },
  {
    pin: 3333,
    title: 'Quiz 3',
    questions: [
      {
        title: 'Question 1',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 1,
      },
      {
        title: 'Question 2',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 0,
      }
    ],
  },
];

app.get('/teacher', (req, res) => {
  res.send(quizzes);
});

app.get('/pupil',  (req, res) => {
  res.send('Enter quiz pin');
});

app.get('/teacher/:quizId', (req, res) => {
  res.send(`You're requesting ${req.params.quizId} quiz`);
})

app.get('/teacher/edit/:quizId', function (req, res) {
  res.send(`You want to edit ${req.params.quizId} quiz`);
});

server.listen(process.env.PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});