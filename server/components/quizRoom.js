const Quiz = require("../models/quiz");

class QuizRoom {
  constructor(dataCollection) {
    this.pupils = {};
    this.teacher = null;
    this.dataCollection = dataCollection;
    this.quizRating = {};
    this.activeQuizess = {};
  }

  listen(client) {
    client.on('message', (message) => {
      const messageObject = this.getMessage(message);
      const { userName } = messageObject;
      if (userName.startsWith('teacher')) {
        this.teacher = client;
        this.handleTeacherEvents(messageObject);
      }
      if (userName.startsWith('pupil')) {
        this.addPupil(userName, client);
        this.handlePupilsEvents(messageObject);
      }
    });
    client.on('error', e => ws.send(e));
  }

  handleTeacherEvents(messageObject) {
    const { eventName, quizId } = messageObject;
    switch (eventName) {
      case 'launch-quiz':
        this.activeQuizess[quizId] = true;
        this.teacher.send(this.convertMessage({ message: `Quiz ${quizId} is active!`}));
        break;
      case 'show-question':
        const { questionId } = messageObject;
        this.notifyPupils({
          eventName: 'show-question',
          questionId: questionId,
        });
        this.teacher.send(this.convertMessage({ message: 'Pupils are notified!'}));
        break;
      default:
        break;
    }
  }

  async handlePupilsEvents(messageObject) {
    console.log('handlePupilsEvents');
    const { eventName, quizId } = messageObject;
    switch (eventName) {
      case 'pupil-join':
        // if (!this.activeQuizess[quizId]) {
        //   this.pupils[messageObject.userName].send(this.convertMessage({ error: 'Подключение к неактивной викторине' }));
        //   break;
        // }
        // const quizData = await this.dataCollection.findOne({ pin: Number(quizId) });
        // if (!quizData) {
        //   this.pupils[messageObject.userName].send(this.convertMessage({ error: 'Подключение к несуществующей викторине' }));
        // } else {
        //   this.pupils[messageObject.userName].send(this.convertMessage({ eventName: 'wait-for-quiz-activation', quizData: quizData }));
        // }
        // this.pupils[messageObject.userName].send(this.convertMessage({ eventName: 'wait-for-quiz-activation', quizData: quizData }));
        this.teacher.send(this.convertMessage({
          eventName: 'pupil-joined-quiz'
        }));
      case 'select-answer':
        const { questionId, answerId } = messageObject;
        if (!this.quizRating[messageObject.userName] ) {
          this.quizRating[messageObject.userName] = {};
        }
        this.quizRating[messageObject.userName][questionId] = answerId;
        this.teacher.send(this.convertMessage({
          eventName: 'update-pupils-data',
          quizRating: this.quizRating,
        }))
        break;
      default:
      break;
    }
  }

  addPupil(name, pupil) {
    if (!this.pupils[name]) {
      this.pupils[name] = pupil;
    }
  }

  convertMessage(messageObject) {
    return JSON.stringify(messageObject);
  }

  getMessage(messageObject) {
    return JSON.parse(messageObject);
  }

  notifyPupils(message) {
    const roomMemberNames = Object.keys(this.pupils);
    roomMemberNames.forEach((memberName) => {
      this.pupils[memberName].send(this.convertMessage(message));
    });
  }

};

module.exports = QuizRoom;