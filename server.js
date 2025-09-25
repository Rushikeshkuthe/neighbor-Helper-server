const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const { connectToDatabase, getDatabase } = require('./_helpers/db'); //  getDatabase  import
const path = require('path');
const routes = require('./routes/index');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use('/v1', routes);

app.use('/test', (req, res) => {
  try {
    res.send('This is test server');
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(__dirname, 'build')));
app.use(errorHandler);

// HTTP + Socket.IO Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// DB connect
connectToDatabase().then(() => {
  console.log('DB ready for socket message');
});

// Socket handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('send_message', async (data) => {
    const db = getDatabase();
    const newMsg = {
      senderId: data.sender,
      receiverId: data.to,
      text: data.text,
      createdAt: new Date(),
    };
    await db.collection('messages').insertOne(newMsg);

    io.to(data.to).emit('receive_message', newMsg);
     io.to(data.sender).emit('receive_message', newMsg);
  //  socket.broadcast.emit('receive_message', data);
  });

  socket.on('register_user', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {             //app.listen karne se naya intance create hoga
  console.log(`Listening on port ${port}`);
  startApp();
});

async function startApp() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Error starting operation');
    process.exit(1);
  }
}
