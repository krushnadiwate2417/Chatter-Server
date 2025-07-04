const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require('express').Router();
const cloudinary = require("./../cloudinary");
const bcrypt = require("bcryptjs");

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

router.post("/uploadProfilePic",authMiddleware, async (req,res)=>{
    try {
        const {image} = req.body;
        const {userId} = req.user;

        //1 Upload Profile Pic to Cloudinary

        const cloudImgUrl = await cloudinary.uploader.upload(image,{
            asset_folder: 'chatter',
            public_id: `profile_${Date.now()}`
        })


        //2. Save imgUrl to MongoDB 
        const user = await User.findOne({_id : userId});

        user.profilePic = cloudImgUrl.secure_url;
        await user.save();

        res.status(201).send({
            success : true,
            message : "Profile Image Uploaded Successfully ! ",
            data : user
        })


    } catch (error) {
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

//change password
router.patch("/changePassword",authMiddleware,async (req,res)=>{
    //1.Compare user's old password
    const user = await User.findOne({_id : req.user.userId}).select("+password");
    
    const oldPasswordCorrect = await bcrypt.compare(req.body.oldPassword,user.password);

    if(!oldPasswordCorrect){
        return res.status(400).send({
            success : false,
            message : "Wrong Old Password"
        })
    };

    const newPassword = await bcrypt.hash(req.body.newPassword,10);
    user.password = newPassword;
    await user.save();

    res.status(201).send({
        success : true,
        message : "Password Changes Successfully!"
    })

})


module.exports = router;