const User=require("../model/user")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController=async(req,res)=>{
    const {username,email,password}=req.body

    console.log(username,email,password);

    if(username==""||email==""||password==""){
        return res.json({msg:"Please fill all the field"})

    }

    const userdata=await User.findOne({email:email})
    console.log(userdata);
    
    if(userdata){
        return res.json({msg:"Email already exists"})
    }

    const emailRegex=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    if(!emailRegex.test(email)){
        return res.json({msg:"Email is not valid"})
    }
    if(password.length<6){
        return res.json({msg:"Password must be atleast 6 characters"})
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    
    const newUser=await User.create({
        username,
        email,
        password:hashedPassword
    })
    await newUser.save()

    res.json({msg:"User saved"})

}


const loginController=async(req,res)=>{
    const {email,password}=req.body
    console.log(email,password);

    const user=await User.findOne({email:email})

    console.log(user);

    const isValidPassword=await bcrypt.compare(password,user.password)

    if(!isValidPassword){
        return res.json({msg:"password incorrect"})
    }

    const token=jwt.sign({ userId: user._id },process.env.JWT_SECRET,{
        expiresIn: "1h",
    }) 

    console.log(token);
    

    res.status(200).json({msg:"Login Success",token:token})
    



}


module.exports={registerController,loginController  }
