import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import imageRouter from './routes/imageRoutes.js'
const port=4000
const app=express()
app.use(express.json())
app.use(cors())
await connectDB()
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)
app.get('/',(req,res)=>{

    res.send('API WORKING')
})
app.listen(port,()=>{
    console.log('server started')
})



