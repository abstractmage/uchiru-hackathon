const Quiz = require("../models/quiz");

class QuizRoom {
  constructor(dataCollection) {
    this.pupils = {};
    this.teacher = null;
    this.dataCollection = dataCollection;
    this.pupilsData = {};
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
    client.send('Hi there, I am a WebSocket server');
  }

  handleTeacherEvents(messageObject) {
    const { eventName, quizId } = messageObject;
    switch (eventName) {
      case 'launch-quiz':
        this.activeQuizess[quizId] = true;
        break;
      case 'show-question':
        const { questionId, timer } = messageObject;
        this.notifyPupils({
          eventName: 'show-question',
          questionId: questionId,
          timer: timer
        });
        this.teacher.send('Pupils are notified!');
        break;
      default:
        break;
    }
  }

  async handlePupilsEvents(messageObject) {
    console.log('handlePupilsEvents');
    const { eventName, userName, quizId } = messageObject;
    switch (eventName) {
      case 'pupil-join':
        if (!this.activeQuizess[quizId]) {
          this.pupils[userName].send(this.convertMessage({ error: 'Подключение к неактивной викторине' }));
          break;
        }
        const quizData = await this.dataCollection.findOne({ pin: Number(quizId) });
        if (!quizData) {
          this.pupils[userName].send(this.convertMessage({ error: 'Подключение к несуществующей викторине' }));
        } else {
          this.pupils[userName].send(this.convertMessage({ eventName: 'wait-for-quiz-activation', quizData: quizData }));
        }
        this.teacher.send(this.convertMessage({
          eventName: 'pupil-joined-quiz'
        }));
      case 'select-answer':
        const { userName, questionId, answerId } = messageObject;
        if (!this.pupilsData[userName] ) {
          this.pupilsData[userName] = {};
        }
        this.pupilsData[userName][questionId] = answerId;
        this.teacher.send(this.convertMessage({
          eventName: 'update-pupils-data',
          pupilsData: this.pupilsData,
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