import userModel from "../models/userModel.js"
import  bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import validator from 'validator'
import transactionModel from "../models/transactionModel.js"
import razorpay from 'razorpay'

const registerUser=async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.json({success:false,message:"invalid credentials"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter a valid email"})
        }
        if(password.length < 8){
            return res.json({success:false,message:"please enter a valid password"})
        }
        const salt =await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);
        const userData={
            name,
            email,
            password:hashedPassword
        }
        const newUser=new userModel(userData)
        const user=await newUser.save()
        const token=jwt.sign({id:user.id},process.env.JWT_SCRET)
        res.json({success:true,token,user:{name:user.name}})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User does not exist"})

        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SCRET)
            res.json({success:true,token})
        }else{
           return res.json({success:false,message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const userCredits=async (req,res)=>{
    try{
        const {userId}=req.body;
        const user=await userModel.findById(userId)
        res.json({success:true,credits:user.creditBalance,user:{name:user.name}})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
const paymentRazorpay=async (req,res)=>{
    try{
        const {userId,planId}=req.body;
        const userDta=await userModel.findById(userId)
        if(!userDta || !planId){
            return res.json({success:false,message:'Missing Details'})
        }
        let credits,plan,amount,date
        switch(planId){
            case 'Basic':
                plan='Basic'
                credits=15
                amount=10
                break
            case 'Advanced':
                plan='Advanced'
                credits=70
                amount=30
                break
            case 'Premier':
                plan='Premier'
                credits=150
                amount=50
                break  
            default:
               return res.json({success:false,message:'plan not found'})      
        }
        date=Date.now()
        const transactionData={
            userId,plan,amount,credits,date
        }
        const newTransaction=await transactionModel.create(transactionData)
        const options={
            amount:amount*100,
            currency:process.env.CURRENCY,
            receipt:newTransaction.key_id
        }
        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error)
                return res.json({success:false,message:error.message})
            }
            res.json({success:true,order})
        })
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const verifyRazorpay=async (req,res)=>{
    try{
        const {razorpay_order_id}=req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status==='paid'){
            const transactionData=await transactionModel.findById(orderInfo.receipt)
            if(transactionData.payment){
                return res.json({success:false,message:'Payment Failed'})
            }
            const userData=await userModel.findById(transactionData.userId)
            const creditBalance=userData.creditBalance+transactionData.credits
            await userModel.findByIdAndUpdate(userData._id,{creditBalance})
            await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})
            res.json({success:true,message:"Credits Added"})
        }else{
            res.json({success:false,message:'Payment Failed'})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}



export {registerUser,loginUser,userCredits,verifyRazorpay,paymentRazorpay}
