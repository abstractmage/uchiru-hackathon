
require('./models/quiz');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const router = require('./routes/index');

const mongoose = require('mongoose');

const connectionParams={
  useNewUrlParser: true,
  useUnifiedTopology: true
}
mongoose.connect(process.env.DB_CONNECTION_URL, connectionParams);
const kahootDb = mongoose.connection;
kahootDb.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

const mainRouter = router.getRouter(kahootDb);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', mainRouter);
app.use((error, req, res, next) => {
    res.status(400).json({
      error: error.message
    });
});

module.exports = app;