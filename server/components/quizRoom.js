/**
 * 
 * Teacher events     { type: 'teacher' }
 * 
 * wait-for-pupils    { quizId, pin }           -->
 * pupil-join         { nickname }              <--
 * launch-quiz        {}                        -->
 * start-timer        {}                        <--
 * timer-end          {}                        -->
 * show-question      { index }                 <--
 * question-shown     {}                        -->
 * start-question     {}                        <--
 * timeout            {}                        -->
 * question-results   { stats, rightAnswer }    <--
 * finish-question    {}                        -->
 * hide-question      {}                        <--
 * question-hidden    {}                        -->
 * finish             { ladder }                <--
 * 
 * ============================================
 * 
 * Pupil events       { type: 'pupil' }
 * 
 * pupil-join         { nickname, quizId, pin }   -->
 * start-timer        {}                          <--
 * timer-end          {}                          -->
 * show-question      { index }                   <--
 * question-shown     {}                          -->
 * start-question     {}                          <--
 * timeout            { answer }                  -->
 * question-results   { rightAnswer }             <--
 * hide-question      {}                          <--
 * question-hidden    {}                          -->
 * finish             { top, ladder, score }
 * 
 */

class QuizRoom {
  constructor(dataCollection) {
    this.pupils = [];
    this.teacher = null;
    this.dataCollection = dataCollection;
    this.quiz = null;
    this.currentQuestion = null;
  }

  listen(client) {
    client.on('message', (message) => {
      const messageObject = this.getMessage(message);
      console.log(messageObject);
      const { type } = messageObject;

      if (type === 'teacher') {
        this.handleTeacherEvents(messageObject, client);
      }

      if (type === 'pupil') {
        this.handlePupilsEvents(messageObject, client);
      }
    });

    client.on('error', e => client.send(e));
  }

  handleTeacherEvents(messageObject, client) {
    const { eventName, ...params } = messageObject;

    switch (eventName) {
      case 'wait-for-pupils':
        this.handleTeacherWaitForPupils({ pin: params.pin, client });
        break;

      case 'launch-quiz':
        this.handleTeacherLaunchQuiz();
        break;

      case 'timer-end':
        this.handleQuestionHidden(client);
        break;

      case 'question-shown':
        this.handleQuestionShown(client);
        break;

      case 'timeout':
        this.handleTimeout({
          client,
          type: params.type,
        });
        break;

      case 'finish-question':
        this.handleTeacherFinishQuestion();
        break;

      case 'question-hidden':
        this.handleQuestionHidden(client);
        break;

      default:
        break;
    }
  }

  handleTeacherWaitForPupils({ pin, client }) {
    this.dataCollection.findOne({ pin: Number(pin) }).then((doc) => {
      this.teacher = {
        type: 'teacher',
        client,
        waiting: false,
      };
      this.quiz = doc;
    });
  }

  handleTeacherLaunchQuiz() {
    this.teacher.waiting = true;
    this.teacher.client.send(
      this.convertMessage({
        eventName: 'start-timer',
      }),
    );

    this.pupils.forEach((p) => {
      p.waiting = true;
      p.client.send(
        this.convertMessage({
          eventName: 'start-timer',
        }),
      );
    });
  }

  handleQuestionHidden(client) {
    const users = [this.teacher, ...this.pupils];
    const currentUser = users.find((u) => u.client === client);
    currentUser.waiting = true;

    if (!users.every((u) => u.waiting)) return;

    if (this.hasAvailablePendingQuestions()) {
      this.currentQuestion = this.getNextQuestion();

      users.forEach((u) => {
        u.waiting = false;
        u.client.send(
          this.convertMessage({
            eventName: 'show-question',
            index: this.currentQuestion,
          })
        )
      });
      return;
    }

    const questionsCount = this.quiz.questions.length;
    const questionRightAnswers = this.quiz.questions.map((q) => q.rightAnswer);
    const ladder = users
      .filter((u) => u.type === 'pupil')
      .map((p) => ({
        nickname: p.nickname,
        score: [
          questionRightAnswers.filter((a, i) => a === p.answers[i]).length,
          questionsCount,
        ],
      }))
      .sort((prev, next) => prev.score[0] < next.score[0] ? 1 : -1);

    users.forEach((u) => {
      if (u.type === 'teacher') {
        u.client.send(
          this.convertMessage({
            eventName: 'finish',
            ladder,
          })
        );
      } else {
        u.client.send(
          this.convertMessage({
            eventName: 'finish',
            ladder,
            score: ladder.find((l) => l.nickname === u.nickname).score,
            top: ladder.findIndex((l) => l.nickname === u.nickname) + 1,
          })
        );
      }
    });
  }

  handleQuestionShown(client) {
    const users = [this.teacher, ...this.pupils];
    const currentUser = users.find((u) => u.client === client);
    currentUser.waiting = true;

    if (!users.every((u) => u.waiting)) return;

    users.forEach((u) => {
      u.waiting = false;
      u.client.send(
        this.convertMessage({
          eventName: 'start-question',
        })
      );
    });
  }

  handleTimeout({ client, type, answer }) {
    if (type === 'teacher') {
      this.teacher.waiting = true;
    } else {
      const pupil = this.pupils.find((p) => p.client === client);
      pupil.waiting = true;
      pupil.answers[this.currentQuestion] = answer;
    }

    const users = [this.teacher, ...this.pupils];

    if (!users.every((u) => u.waiting)) return;

    const question = this.quiz.questions[this.currentQuestion];
    const rightAnswer = question.rightAnswer;
    const allAnswers = this.pupils.map((p) => p.answers[this.currentQuestion])
      .filter((a) => a !== null);

    users.forEach((u) => {
      u.waiting = false;
      u.client.send(
        this.convertMessage({
          eventName: 'question-results',
          stats: u.type === 'teacher' ? this.getStats(question.answers.length, allAnswers) : undefined,
          rightAnswer,
        })
      );
    });
  }

  handleTeacherFinishQuestion() {
    const users = [this.teacher, ...this.pupils];

    users.forEach((u) => {
      u.client.send(
        this.convertMessage({
          eventName: 'hide-question',
        })
      );
    });
  }

  handlePupilsEvents(messageObject, client) {
    if (this.teacher === null) return;

    const { eventName, ...params } = messageObject;

    switch (eventName) {
      case 'pupil-join':
        this.handlePupilJoin({
          nickname: params.nickname,
          pin: params.pin,
          client,
        });
        break;

      case 'timer-end':
        this.handleQuestionHidden(client);
        break;

      case 'question-shown':
        this.handleQuestionShown(client);
        break;

      case 'timeout':
        this.handleTimeout({
          client,
          type: params.type,
          answer: params.answer,
        });
        break;

      case 'question-hidden':
        this.handleQuestionHidden(client);
        break;

      default:
        break;
    }
  }

  handlePupilJoin({ nickname, pin, client }) {
    if (this.quiz.pin !== pin) return;

    this.teacher.client.send(
      this.convertMessage({
        eventName: 'pupil-join',
        nickname,
      })
    );

    this.pupils.push({
      type: 'pupil',
      nickname,
      client,
      answers: this.quiz.questions.map(() => null),
      waiting: false,
    });
  }

  convertMessage(messageObject) {
    return JSON.stringify(messageObject);
  }

  getMessage(messageObject) {
    return JSON.parse(messageObject);
  }

  hasAvailablePendingQuestions() {
    return this.currentQuestion !== this.quiz.questions.length - 1;
  }

  getNextQuestion() {
    return this.currentQuestion === null ? 0 : this.currentQuestion + 1;
  }

  getStats(answersCount, allAnswers) {
    const indexes = new Array(answersCount).fill().map((_, i) => i);

    return indexes.map((i) => allAnswers.filter((a) => a === i).length);
  }
}

module.exports = QuizRoom;