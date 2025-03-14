const mongoose=require('mongoose')


const userSchema=mongoose.Schema(
    {
        username:{type:String,required:true},
        email:{type:String,required:true},
        password:{type:String,required:true},
        role:{type:String,enum:['user','admin'],default:'user'},
        resetPasswordToken: { type: String }, // For password reset
        resetPasswordExpires: { type: Date }, // Expiry time for reset token
    }
)
module.exports=mongoose.model("User",userSchema)