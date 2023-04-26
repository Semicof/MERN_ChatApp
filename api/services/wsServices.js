const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const ws = require('ws');
const fs = require('fs');
dotenv.config();
const jwtSecret = process.env.JWT_KEY;

const setupWebSocketServer = (server) => {
    const wss = new ws.WebSocketServer({server});
  
    wss.on('connection', handleConnection);
  
    function handleConnection(connection, req) {
      setupConnection(connection, req);
      setupPingTimer(connection);
      setupMessageListener(connection);
      notifyAboutOnlinePeople();
    }
  
    function setupConnection(connection, req) {
      connection.isAlive = true;
      const cookies = req.headers.cookie;
      if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
          const token = tokenCookieString.split('=')[1];
          if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
              if (err) throw err;
              const {userId, username} = userData;
              connection.userId = userId;
              connection.username = username;
            });
          }
        }
      }
    }
  
    function setupPingTimer(connection) {
      connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
          connection.isAlive = false;
          clearInterval(connection.timer);
          connection.terminate();
          notifyAboutOnlinePeople();
        }, 1000);
      }, 5000);
  
      connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
      });
    }
  
    function setupMessageListener(connection) {
      connection.on('message', (message) => {
        handleMessage(message, connection);
      });
    }
    
  
    async function handleMessage(message, connection) {
      const messageData = JSON.parse(message.toString());
      const {recipient, text, file} = messageData;
      if (recipient && text) {
        const messageDoc = await Message.create({
          sender:connection.userId,
          recipient,
          text,
          file: file ? filename : null,
        });
        console.log('created message');
        [...wss.clients]
          .filter(c => c.userId === recipient)
          .forEach(c => c.send(JSON.stringify({
            text,
            sender:connection.userId,
            recipient,
            file: file ? filename : null,
            _id:messageDoc._id,
          })));
      }
    }
    
  
    function notifyAboutOnlinePeople() {
      [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
          online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
        }));
      });
    }
  };
  
module.exports = setupWebSocketServer;
  