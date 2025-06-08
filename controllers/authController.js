const User = require("../models/userModel");
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//Sign Up
router.post("/signup",async (req,res)=>{
    try {

        const user = await User.findOne({email : req.body.email});
        if(user){
            return res.send({
                message : "User already Exist, Try logging in ! ",
                success : false,
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();

        const token = jwt.sign({userId : newUser._id},process.env.JSON_SECRET_KEY,{expiresIn: "1d"})

        res.status(201).send({
            message : "User created Successfully",
            success : true,
            token : token,
            user : newUser
        })
    } catch (error) {
        res.send({
            message : error.message,
            success : false
        })
    }
})


//Log in 
router.post("/login",async(req,res)=>{
    try {
        const user = await User.findOne({email : req.body.email});
        if(!user){
            return res.status(400).send({
                message : "No user Exist, Try Signing up/Create ",
                success : false,
            })
        }

        const comapringPass =await bcrypt.compare(req.body.password,user.password);
        if(!comapringPass){
            return res.status(400).send({
                message : "Wrong Password, Try Correct",
                success : false,
            })
        }

        if(user && comapringPass){

            const token = jwt.sign({userId : user._id},process.env.JSON_SECRET_KEY,{expiresIn: "1d"})

            res.status(200).send({
                message : "User found",
                success : true,
                token : token,
                data : user
            })
        }
    } catch (error) {
        res.send({
            message : error.message,
            success : false
        })
    }
})


module.exports = router;