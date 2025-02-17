const mongoose=require('mongoose')


const adminSchema=mongoose.Schema(
    {
        email:String,
        password:String,

    }
)
module.export=mongoose.model("admin",adminSchema)