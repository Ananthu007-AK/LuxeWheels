const express=require('express')
const app=express()
require('dotenv').config()
app.use(express.json())
const db=require('./model/db')
const userRoutes = require('./routes/user')
const cors=require('cors')
db.connect()




const PORT=process.env.PORT || 3003


app.use(cors())



app.use('/user',userRoutes)




app.get('/',(req,res)=>{
    res.send('Hello World')
})


app.post('/',(req,res)=>{
    res.json(req.body)
})


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    
})