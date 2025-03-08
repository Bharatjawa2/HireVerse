import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user=true;
  return (
    <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
            <img src={assets.hire} alt='' className='w-45 h-12'/>
            {
              user
              ?
              <div className='flex items-center gap-3'>
                <Link to="/application">Applied Jobs</Link>
                <p>|</p>
                <p>Hi, {user.fullname}</p>
                {/* <UserButton/> */}
              </div>
              :
              <div className='flex gap-4 max-sm:text-xs'>
                <button className='text-gray-600'>Recruiter Login</button>
                <button className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>
            }
        </div>
    </div>
  )
}

export default Navbar