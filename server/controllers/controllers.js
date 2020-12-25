const { collection } = require("../models/quiz");

const controllers = (collection) => {

  const addQuiz = async (req, res, next) => {
    try {
      const { body } = req;
      if (body) {
        const newQuiz = new Quiz(body);
        await collection.insertOne(newQuiz);
        return res.status(200).json({
          success: true,
          message:'Quiz saved!',
        });
      }
    } catch (err) {
      let errors=result.mapped(), error_msg='';
      for(let key in errors) error_msg+=`${errors[key].msg}\n`;
      next(new Error(error_msg));
    }
  };

  const getQuiz = async (req, res, next) => {
    if (req.body.pin) {
      try {
        const result = await collection.findOne({ pin: req.body.pin });
        if (result) {
          return res.json({ success: false, error: err });
        }
      } catch (err) {
      return res.json({ success: true, quiz: data });
      }
    }
  };

  const getAllQuizess = async (req, res, next) => {
    try {
      const quizzesCursor = await quizzesCollection.find();
      const result = [];
      quizzesCursor.forEach((value) => {
        result.push(value);
      });
      return res.json({ success: true, quizess: result });
    } catch(err) {
      return res.json({ success: false, error: err });
    }
  };

  const updateQuiz = async (req, res, next) => {
    try {
      const { update, pin } = req.body;
      const filter = { pin: pin };
      const updateDoc = {
        $set: update
      };
      await collection.updateOne(filter, updateDoc);
    } catch(err) {
      return res.json({ success: false, error: err });
    }
  };

  return {
    getAllQuizess: getAllQuizess,
    getQuiz: getQuiz,
    addQuiz: addQuiz,
    updateQuiz: updateQuiz,
  };
};

module.exports = {
  controllers: controllers
};
