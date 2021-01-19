require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const router = require('./routes/index');

const mongoose = require('mongoose');

const connectionParams={
  useNewUrlParser: true,
  useUnifiedTopology: true
}
mongoose.connect(process.env.DB_CONNECTION_URL, connectionParams);
const kahootDb = mongoose.connection;
kahootDb.on('error', console.error.bind(console, 'connection error:'));
kahootDb.once("open", function() {
  console.log("MongoDB database connection established successfully");
});
const dataCollection = kahootDb.collection('Quizess');
const appRouter = router.getRouter(dataCollection);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', appRouter);


const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ server });
const QuizRoom = require('./components/quizRoom');
const quizRoom = new QuizRoom(dataCollection);
webSocketServer.on('connection', client => quizRoom.listen(client));
server.listen(process.env.PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});