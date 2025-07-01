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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/message",messageRouter);

let onlineUsers = []
//Testing COnnection
io.on('connection',socket => {
    socket.on('join-room',userId=>{
        socket.join(userId);
    })

    socket.on('send-message',(message)=>{
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('recieve-message',message);

        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('set-msg-count',message);
    })

    socket.on('clear-unread-msgs', data =>{
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('msg-count-cleared',data)
    })

    socket.on('user-typing',(data)=>{
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('started-typing',data)

    })

    socket.on("users-login",userId=>{
        if(!onlineUsers.includes(userId)){
            onlineUsers.push(userId);
        }
        socket.emit('onlineUsers-list',onlineUsers);
    })

    socket.on("logout",(userId)=>{
        if(onlineUsers.includes(userId)){
            onlineUsers = onlineUsers.filter((id)=>{
                id !== userId
            })
        }
        socket.emit('onlineUsers-list-updated',onlineUsers);
    })

})

module.exports = server;