const express=require('express')
const app=express()
require('dotenv').config()
app.use(express.json())
const db=require('./model/db')
const userRoutes = require('./routes/user')
const cors=require('cors')
db.connect()

const authRoutes = require('./routes/authRoutes')


const PORT=process.env.PORT || 3003


app.use(cors())

app.use('/uploads', express.static('uploads'));

app.use('/enquiries', require('./routes/enquiries'));


app.use('/user',userRoutes)

app.use('/users',authRoutes)

app.use('/cars',require('./routes/CarRoutes'))

app.use('/rentals',require('./routes/rentalRoutes'))


app.get('/',(req,res)=>{
    res.send('Hello World')
})


app.post('/user/register', (req, res) => {
    res.json({ message: "User registered successfully!" });
});


app.post('/',(req,res)=>{
    res.json(req.body)
})


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    
})