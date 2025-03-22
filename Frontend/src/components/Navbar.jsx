import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const {
    setShowRecruiterLogin,
    setShowLogin,
    setUserToken,
    setUserData,
    userData,
    userToken,
    backendUrl,
  } = useContext(AppContext);
  const [showLogout, setShowLogout] = useState(false); // State to control logout button visibility

  const handleShowRecruiterLogin = () => {
    setShowRecruiterLogin(true);
    setShowLogin(false);
  };

  const handleShowUserLogin = () => {
    setShowLogin(true);
    setShowRecruiterLogin(false);
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v2/user/logout`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        setUserData(null); // Clear user data from context
        setUserToken(false); // Set userToken to false
        navigate('/'); // Redirect to home page
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <img
          onClick={() => navigate('/')}
          src={assets.hire}
          alt='Company Logo'
          className='w-50 h-14 object-contain cursor-pointer'
        />
        {userToken ? (
          <div className='flex items-center gap-3'>
            <Link to='/application'>Applied Jobs</Link>
            <p className='max-sm:hidden'>|</p>
            <p className='max-sm:hidden'>Hi, {userData ? userData.name : 'User'}</p>
            <div
              className='relative'
              onMouseEnter={() => setShowLogout(true)} // Show logout button on hover
              onMouseLeave={() => setShowLogout(false)} // Hide logout button on mouse leave
            >
              <img
                src={userData?.image || assets.profile_img}
                alt='Profile'
                className='w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300'
              />
              {showLogout && (
                <button
                  onClick={logout}
                  className='absolute top-10 right-0 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-all'
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='flex gap-4 max-sm:text-xs'>
            <button onClick={handleShowRecruiterLogin} className='text-gray-600'>
              Recruiter Login
            </button>
            <button
              onClick={handleShowUserLogin}
              className='bg-gray-600 text-white px-6 sm:px-9 py-2 rounded-full'
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;