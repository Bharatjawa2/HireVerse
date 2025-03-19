import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';

const Navbar = () => {
  const user=false;
  const navigate=useNavigate();
  const {setShowRecruiterLogin,setShowLogin}=useContext(AppContext);
  const handleShowRecruiterLogin = () => {
    setShowRecruiterLogin(true);
    setShowLogin(false);
  };

  const handleShowUserLogin = () => {
    setShowLogin(true);
    setShowRecruiterLogin(false);
  };
  return (
    <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
            <img onClick={()=>navigate('/')} src={assets.hire} alt='' className='w-50 h-14 object-contain cursor-pointer'/>
            {
              user
              ?
              <div className='flex items-center gap-3'>
                <Link to="/application">Applied Jobs</Link>
                <p className='max-sm:hidden'>|</p>
                <p className='max-sm:hidden'>Hi, {user.fullname}</p>
                {/* <UserButton/> */}
              </div>
              :
              <div className='flex gap-4 max-sm:text-xs'>
                <button onClick={handleShowRecruiterLogin} className='text-gray-600'>Recruiter Login</button>
                <button onClick={handleShowUserLogin} className='bg-gray-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>
            }
        </div>
    </div>
  )
}

export default Navbar