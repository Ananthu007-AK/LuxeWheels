const mongoose=require('mongoose')

const uri="mongodb://localhost:27017/LuxeWheels"

const connect= () => { mongoose.connect(uri)
    .then(()=>{ console.log(`MDB Connected ${uri}`) })
    .catch((err)=>{ console.log(err) })
}
module.exports={connect}  