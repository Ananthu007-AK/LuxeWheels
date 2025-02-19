const express=require('express')
const router=express.Router()
const userController=require('../controllers/user')
const{loginvalidation,registervalidation}=require("../middlewares/validation")


router.post('/register',userController.registerController)

router.post('/login',loginvalidation,userController.loginController)


module.exports=router;