import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext'

const Hero = () => {
  const {setSearchFilter,setIsSearched}=useContext(AppContext);
  const titleRef=useRef(null);
  const locationRef=useRef(null);

  const onSearch=()=>{
    setSearchFilter({
        title:titleRef.current.value,
        location:locationRef.current.value
    })
    setIsSearched(true);
    console.log({
        title:titleRef.current.value,
        location:locationRef.current.value
    })
  }
  return (
    <div className='container mx-auto my-10 2xl:px-20'>
        <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 text-center mx-2 rounded-xl'>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-semibold mb-4'>
                Over 1,000+ jobs to apply
            </h2>
            <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>
                Your next Big Career Move starts Right here - Explore The Best Job Opportunities And Take The First Step Towards Your Future!
            </p>
            <div className='flex items-center justify-between bg-white shadow-md rounded text-gray-900 max-w-xl pl-4 mx-4 sm:mx-auto'>
                <div className='flex items-center w-full'>
                    <img className='h-4 sm:h-5' src={assets.search_icon} alt="search"/>
                    <input type='text' placeholder='Search for Jobs...' 
                        className='max-sm:text-xs p-3 rounded outline-none w-full bg-white text-gray-900'
                        ref={titleRef}/>
                </div>
                <p className='text-gray-400 mr-3'>|</p>
                <div className='flex items-center w-full'>
                    <img className='h-4 sm:h-5' src={assets.location_icon} alt="location"/>
                    <input type='text' placeholder='Location' 
                        className='max-sm:text-xs p-3 rounded outline-none w-full bg-white text-gray-900'
                        ref={locationRef}
                    />
                </div>
                <button onClick={onSearch} className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded px-6 py-2 m-1 font-medium transition'>
                    Search
                </button>
            </div>
        </div>
        <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex">
            <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
                <p className='font-medium'>Trusted By</p>
                <img className='h-6' src={assets.microsoft_logo} alt="" />
                <img className='h-6' src={assets.accenture_logo} alt="" />
                <img className='h-6' src={assets.walmart_logo} alt="" />
                <img className='h-6' src={assets.samsung_logo} alt="" />
                <img className='h-6' src={assets.amazon_logo} alt="" />
                <img className='h-6' src={assets.adobe_logo} alt="" />          
            </div>
        </div>
    </div>
  )
}

export default Hero
