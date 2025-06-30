const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const server = require("./app");
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONN_STR)
.then(()=>{console.log("DB connected Successfully")})
.catch((err)=>{console.log(err)});

const port = process.env.SERVER_PORT;
server.listen(port,()=>{
    console.log(`Server started on : ${port}`)
})