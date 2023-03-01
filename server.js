const mongoose= require('mongoose');
mongoose.set('strictQuery', true);
const express= require('express')
const cors = require("cors");
const router=express.Router();
require ('dotenv').config()
const connectdb= require("./db")
const http = require('http');
const socketIO = require('socket.io');
const webrtc = require('webrtc-adapter');
const bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(cors())

connectdb()

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.json())
app.use('/api/user', require('./routes/userRoutes'))

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('offer', (id, description) => {
    socket.to(id).emit('offer', socket.id, description);
  });

  socket.on('answer', (id, description) => {
    socket.to(id).emit('answer', socket.id, description);
  });

  socket.on('candidate', (id, candidate) => {
    socket.to(id).emit('candidate', socket.id, candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server started at :${port}`);
});