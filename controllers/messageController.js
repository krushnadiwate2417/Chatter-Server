const router = require('express').Router();
const Chat = require('./../models/chatSchema');
const authMiddleware = require('./../middlewares/authMiddleware');
const Message = require('./../models/messageModel');

router.post("/sendMessage",authMiddleware,async (req,res)=>{
    try {
        
        const message = new Message(req.body);
        const savedMessage = await message.save();

        const chatUpdate = await Chat.findOneAndUpdate(
            {_id : req.body.chatId},
            {
                lastMessage : savedMessage._id,
                $inc : {unReadMessageCount : 1}
            }
        )

        res.status(201).send({
            message : "Message sent successfully ! ",
            success : true,
            data : savedMessage
        })

    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

router.get("/getAllMessages/:chatId",authMiddleware,async (req,res)=>{
    try {
        
        const getAllMessage = await Message.find({chatId : req.params.chatId})
                                            .sort({createdAt : 1});


        res.status(200).send({
            message : "Messages fetched successfully ! ",
            success : true,
            data : getAllMessage
        })

    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

module.exports = router;