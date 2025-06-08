const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require('express').Router();

router.get("/getLoggedUser",authMiddleware,async(req,res)=>{
    try {
        console.log(req.body);

        const user = await User.findOne({_id : req.user.userId});
        if(user){
            res.status(200).send({
                success : true,
                user
            })
        }

    } catch (error) {
        res.status(404).send({
            message : error.message,
            success : false
        })
    }
})


module.exports = router;