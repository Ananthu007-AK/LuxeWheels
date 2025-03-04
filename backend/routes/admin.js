const express=require('express')
const router=express.Router()
const adminController=require('../controllers,admin')


router.post('/admin',adminController)

module.exports=router