const express=require('express')
const router=express.Router()
const {verifyToken,adminVerifyToken}=require("../middlewares/authMiddleware");
const user = require('../model/user');

router.get('/user-dashboard',verifyToken,(req,res)=>{
    res.json({msg:"User Dashboard",user:req.user});
})  

router.get('/admin-dashboard',verifyToken,adminVerifyToken,(req,res)=>{
    res.json({msg:"Admin Dashboard",admin:req.user});
})

module.exports=router;