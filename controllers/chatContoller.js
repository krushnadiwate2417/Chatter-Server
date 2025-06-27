const router = require('express').Router();
const Chat = require('./../models/chatSchema');
const authMiddleware = require('./../middlewares/authMiddleware');
const Message = require("./../models/messageModel");


router.post("/startNewChat",authMiddleware, async(req,res)=>{
    try {
        const chat = new Chat(req.body);
        const savedChat =await chat.save();
        await savedChat.populate('members');
        res.status(201).send({
            message : "Chat started successfully ! ",
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
        const allChats = await Chat.find({members : {$in : req.user.userId}})
                        .populate('members')
                        .populate('lastMessage')
                        .sort({updatedAt : -1});

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

router.patch("/clearUnreadMessages",authMiddleware, async(req,res)=>{
        try {
        const {chatId} = req.body;
        const chat = await Chat.findOne({_id : chatId}).populate("members").populate("lastMessage");
        if(!chat){
            return res.status(400).send({
            success : false,
            message : `ChatId ${chatId} : does not exist`,
        })
        }

        chat.unReadMessageCount = 0;
        const upDated = await chat.save();
        
        await Message.updateMany({chatId : chatId,read : false},{read : true})

        res.status(200).send({
            success : true,
            message : "un-read message cound is 0",
            data : upDated
        })
        
    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

module.exports = router;