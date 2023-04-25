const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const setupWebSocketServer = require('./services/wsServices');
const initWebRoute = require('./router/routes');

dotenv.config();
mongoose.connect(process.env.DB_URL, (err) => {
  if (err) throw err;
});


const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));

initWebRoute(app);

const startServer = (port) => {
  const server = app.listen(port);
  setupWebSocketServer(server);
};

startServer(4040);
