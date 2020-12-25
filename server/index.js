require('dotenv').config();
const app = require('./app');
const http = require('http');
const server = http.createServer(app);

app.get('/teacher', (req, res) => {
  res.send('all quizzes');
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