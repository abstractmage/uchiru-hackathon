require('dotenv').config();
const app = require('./app');
const http = require('http');
const server = http.createServer(app);


const quizzes = [
  {
    pin: 1111,
    title: 'Quiz 1',
    preview: '',
    questions: [
      {
        title: 'Question 1',
        image: '',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 1,
        timeLimit: 60,
      },
      {
        title: 'Question 2',
        image: '',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 0,
        timeLimit: 80,
      }
    ],
  },
  {
    pin: 2222,
    title: 'Quiz 2',
    preview: '',
    questions: [
      {
        title: 'Question 1',
        image: '',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 1,
        timeLimit: 60,
      },
      {
        title: 'Question 2',
        image: '',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 0,
        timeLimit: 70,
      }
    ],
  },
  {
    pin: 3333,
    title: 'Quiz 3',
    preview: '',
    questions: [
      {
        title: 'Question 1',
        image: '',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 1,
        timeLimit: 100,
      },
      {
        title: 'Question 2',
        image: '',
        answers: ['answer 1', 'answer 2', 'answer 2'],
        rightAnswer: 0,
        timeLimit: 120,
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