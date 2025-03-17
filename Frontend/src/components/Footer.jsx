import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20'>
        <img width={160} className='object-contain' src={assets.hire} alt=""/>
        <div className='flex gap-2.5'>
            <img width={38} src={assets.instagram_icon} alt=''/>
            <img width={38} src={assets.twitter_icon} alt=''/>
            <img width={14} className='w-10 h-10 flex items-center justify-center border border-gray-400 rounded-full px-2' src={assets.linkedin_icon} alt=''/>
        </div>
    </div>
  )
}

export default Footer