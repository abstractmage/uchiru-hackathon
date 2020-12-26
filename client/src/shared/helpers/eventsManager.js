/* eslint-disable class-methods-use-this */
/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
export default class QuizEventsManager {
  constructor() {
    this.client = null;
    this.clientType = '';
    this.currentQuestionIndex = -1;
    this.quizData = null;
    this.quizActivated = false;
    this.userName = '';
    this.quizRating = {};
  }

  init(clientType) {
    this.clientType = clientType;
    this.client = new WebSocket('ws://localhost:3001');
    this.client.onopen = () => {
      console.log('Соединение установлено.');
    };
    this.client.onmessage = (message) => {
      console.log('message', message.data);
      const messageObject = this.getMessage(message.data);
      if (this.clientType === 'teacher') {
        this.handleTeacherEvents(messageObject);
      }
      if (this.clientType === 'pupil') {
        this.handlePupilEvents(messageObject);
      }
    };
  }

  handleTeacherEvents(messageObject) {
    const { eventName } = messageObject;
    switch (eventName) {
      case 'pupil-joined-quiz':
        this.quizActivated = true;
      // по этому флагу активируется кнопка Начать у учителя
      case 'update-pupils-data':
        const { quizRating } = messageObject;
        this.quizRating = quizRating;
      // по pupilsData надо будет обновлять рейтинг
      default:
        break;
    }
  }

  handlePupilEvents(messageObject) {
    const { eventName } = messageObject;
    switch (eventName) {
      case 'show-question':
        this.quizActivated = true;
        const { questionId } = messageObject;
        this.currentQuestionIndex = Number(questionId);
      // по currentQuestion обновляется инфа на странице ученика
      case 'joined-to-quiz':
        this.quizData = messageObject.quizData;
      // quizData должен быть сохранен где-то у ученика
      default:
        break;
    }
  }

  launchQuiz(quizId) {
    if (this.client.readyState) {
      this.client.send(
        this.convertMessage({
          userName: 'teacher',
          eventName: 'launch-quiz',
          quizId,
        }),
      );
    } else {
      setTimeout(() => {
        this.launchQuiz(quizId);
      }, 100);
    }
  }

  showQuestion(nextQuestionId) {
    // срабатывает по переключению задания
    this.client.send(
      this.convertMessage({
        userName: 'teacher',
        eventName: 'show-question',
        questionId: nextQuestionId,
      }),
    );
  }

  selectAnswer(quizId, questionId, answerId) {
    // срабатывает при выборе ответа учеником
    this.client.send(
      this.convertMessage({
        eventName: 'select-answer',
        userName: `${this.clientType}-${this.userName}`,
        questionId,
        answerId,
        quizId,
      }),
    );
  }

  joinQuiz(userName, quizId) {
    this.userName = userName;
    if (this.client.readyState) {
      this.client.send(
        this.convertMessage({
          userName,
          eventName: 'join-quiz',
          quizId,
        }),
      );
    } else {
      setTimeout(() => {
        this.launchQuiz(quizId);
      }, 100);
    }
  }

  convertMessage(messageObject) {
    return JSON.stringify(messageObject);
  }

  getMessage(message) {
    return JSON.parse(message);
  }
}
