const express = require("express");
const authRouter = require('./controllers/authController');
const userRouter = require("./controllers/userController");

const app = express();

app.use(express.json());
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);


module.exports = app;