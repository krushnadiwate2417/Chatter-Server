const express = require("express");
const authRouter = require('./controllers/authController');
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatContoller");
const messageRouter = require("./controllers/messageController");

const app = express();

app.use(express.json());
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/message",messageRouter);


module.exports = app;