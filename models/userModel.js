const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true,"First Name is Required"]
    },
    lastName : {
        type : String,
        required : [true,"Last Name is Required"]
    },
    email : {
        type : String,
        required : [true,"Email Name is Required"]
    },
    password : {
        type : String,
        required : [true,"Password Name is Required"]
    },
    profilePic : {
        type : String,
        required : false
    }
},{timestamps : true})


module.exports = mongoose.model("users",userSchema);
