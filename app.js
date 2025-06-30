const express = require("express");
const authRouter = require('./controllers/authController');
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatContoller");
const messageRouter = require("./controllers/messageController");
const cors = require('cors');

const app = express();
const allowedOrigins = ['http://localhost:5173'];

const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors : {
        origin : 'http://localhost:5173',
        methods : ['GET','POST','PATCH','DELETE']
    }
})
app.use(cors({
    origin : function (origin,callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        } else {
            callback(new Error('Not Allowed By CORS'))
        }
    },
    credentials : true
}));

app.use(express.json());
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/message",messageRouter);


//Testing COnnection
io.on('connection',socket => {
    socket.on('join-room',userId=>{
        socket.join(userId);
        console.log(`user id  : ${userId}`)
    })

    socket.on('send-message',(data)=>{
        socket.to(data.recipient).emit('recieve-msg',data.text);
    })
})

module.exports = server;