/* eslint-disable class-methods-use-this */
/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
export default class QuizEventsManager {
  constructor(client, clientType, userName = '') {
    this.client = client;
    this.clientType = clientType;
    this.currentQuestionIndex = -1;
    this.quizData = null;
    this.quizActivated = false;
    this.userName = userName;
    this.init();
  }

  init() {
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
        const { pupilsData } = messageObject;
        this.pupilsData = pupilsData;
      // по pupilsData надо будет обновлять рейтинг
      default:
        break;
    }
  }

  handlePupilEvents(messageObject) {
    const { eventName } = messageObject;
    switch (eventName) {
      case 'show-question':
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
    this.client.send(
      this.convertMessage({
        userName: 'teacher',
        eventName: 'launch-quiz',
        quizId,
      }),
    );
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

  convertMessage(messageObject) {
    return JSON.stringify(messageObject);
  }

  getMessage(message) {
    return JSON.parse(message);
  }
}
