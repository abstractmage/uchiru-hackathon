const Quiz= require('../models/quiz');

const controllers = (collection) => {

  const addQuiz = async (req, res, next) => {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
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
      next(new Error(err));
    }
  };

  const getQuiz = async (req, res, next) => {
    const { quizId } = req.params;
    if (quizId) {
      try {
        const result = await collection.findOne({ pin: Number(quizId) });
        if (result) {
          return res.json({ success: true, quiz: result });
        }
      } catch (err) {
        return res.json({ success: false, error: err });
      }
    }
  };

  const getAllQuizess = async (req, res, next) => {
    try {
      const quizzesCursor = await collection.find({});
      const result = [];
      await quizzesCursor.forEach((value) => {
        result.push(value);
      });
      return res.json({ success: true, quizess: result });
    } catch(err) {
      return res.json({ success: false, error: err });
    }
  };

  const updateQuiz = async (req, res, next) => {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      const { quizId } = req.params;
      const { updated } = req.body;
      const filter = { pin: Number(quizId) };
      console.log('updated', updated);
      const updateDoc = {
        $set: updated
      };
      await collection.updateOne(filter, updateDoc);
      return res.status(200).json({
        success: true,
        message:'Quiz updated!',
      });
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
