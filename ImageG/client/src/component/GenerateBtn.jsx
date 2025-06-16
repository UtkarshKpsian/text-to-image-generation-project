import React from 'react'
import {useNavigate} from 'react-router-dom'
import {delay,motion} from "motion/react"
import { assets } from '../assets/assets'
function GenerateBtn() {
  const navigate=useNavigate()
  return (
    <motion.div 
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    className='pb-16 text-center' >
      <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16' >See the Magic. Try Now</h1>
      <button  className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-yellow-500 cursor-pointer text-red-500 m-auto hover:scale-105 transition-all duration-500' onClick={()=>navigate('/buy')} >Subscription
        <img src={assets.star_group} alt="" className='h-6' />
      </button>
    </motion.div>
  )
}

export default GenerateBtn