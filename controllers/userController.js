const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require('express').Router();

router.get("/getLoggedUser",authMiddleware,async(req,res)=>{
    try {
        const user = await User.findOne({_id : req.user.userId});
        if(user){
            res.status(200).send({
                success : true,
                user
            })
        }

    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

router.get("/getAllUsers",authMiddleware,async(req,res)=>{
    try {
        const users = await User.find({_id : {$ne : req.user.userId}});
        if(users){
            res.status(200).send({
                success : true,
                users
            })
        }

    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

module.exports = router;