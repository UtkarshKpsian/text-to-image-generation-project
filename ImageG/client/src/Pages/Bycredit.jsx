import React, { useContext } from 'react'
import { assets ,plans} from '../assets/assets'
import { delay,motion} from "motion/react"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
function Bycredit() {
  const {user,backendUrl,loadCreditsData,token,setShowLogin}=useContext(AppContext)
  const navigate=useNavigate()
  const initpay=async(order)=>{
    const options={
      key:import.meta.env.RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Credits Payment',
      description:'Credits Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler:async (response) =>{
        try {
          const {data}=await axios.post(backendUrl+'/api/user/verify-razor',response,{headers:{token}})
          if(data.success){
            loadCreditsData()
            navigate('/')
            toast.success('credit Added')
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    const rzp=new window.Razorpay(options)
    rzp.open()
  }
  const paymentRazorpay=async(planId)=>{
    try {
      if(!user){
        setShowLogin(true)
      }
      const {data}=await axios.post(backendUrl+'api/user/pay-razor',{planId},{headers:{token}})
      if(data.success){
        initpay(data.order)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <motion.div
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
     viewport={{once:true}}
    className='min-h-[80vh] text-center pt-14 mb-10' >
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6' >Our Subscription</button>
      <h1 className='text-center text-3xl font-bold mb-6 sm:mb-10' >Choose the Subscription</h1>
      <div className='flex flex-wrap justify-center gap-6 text-left' >
        {plans.map((item,index)=>(
          <div key={index} className='bg-pink-50 drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500' >
            <img src={assets.lock_icon} alt="" width={40} /> 
            <p className='mt-3 mb-1 font-semibold' >{item.id}</p>
            <p className='text-sm' >{item.desc}</p>
            <p className='mt-6' ><span className='text-3xl' >₹{item.price}</span> / {item.credits}</p>
            <button onClick={()=>paymentRazorpay(item.id)} className='w-full bg-blue-600 text-white mt-8 text-sm rounded-full py-2.5 min-w-52'>Purchase</button>
            </div>
        ))}
      </div>
    </motion.div>
  )
}

export default Bycredit