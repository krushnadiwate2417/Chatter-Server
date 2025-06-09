const router = require('express').Router();
const Chat = require('./../models/chatSchema');
const authMiddleware = require('./../middlewares/authMiddleware');


router.post("/startNewChat",authMiddleware, async(req,res)=>{
    try {
        const chat = new Chat(req.body);
        const savedChat =await chat.save();

        res.status(201).send({
            message : "Chat created/started successfully ! ",
            success : true,
            data : savedChat
        })
    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

router.get("/getAllChats",authMiddleware, async(req,res)=>{
    try {
        const allChats = await Chat.find({members : {$in : req.user.userId}});

        res.status(200).send({
            message : "Chats Fetched successfully ! ",
            success : true,
            data : allChats
        })
    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

module.exports = router;