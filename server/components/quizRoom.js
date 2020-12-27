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
    client.on('error', e => client.send(e));
  }

  handleTeacherEvents(messageObject) {
    const { eventName, quizId } = messageObject;
    switch (eventName) {
      case 'launch-quiz':
        this.activeQuizess[quizId] = true;
        this.teacher.send(this.convertMessage({ message: `Quiz ${quizId} is active!`}));
        break;
      case 'show-question':
        this.notifyPupils({
          eventName: 'show-question',
          questionId: messageObject.questionId,
        });
        this.teacher.send(this.convertMessage({ message: 'Pupils are notified!'}));
        break;
      default:
        break;
    }
  }

  async handlePupilsEvents(messageObject) {
    console.log('handlePupilsEvents');
    const { eventName, questionId, answerId } = messageObject;
    switch (eventName) {
      case 'pupil-join':
        this.teacher.send(this.convertMessage({
          eventName: 'pupil-joined-quiz'
        }));
        break;
      case 'select-answer':
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
}

module.exports = QuizRoom;