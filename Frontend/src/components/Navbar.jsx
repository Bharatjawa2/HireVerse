import React, { useContext, useState, useRef } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const fileInputRef = useRef(null); // Ref for file input

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v2/user/update-profile-picture`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setUserData(data.user); // Update user data in context
        alert('Profile picture updated successfully');
      } else {
        alert('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Something went wrong');
    }
  };

  const handleMouseEnter = () => {
    setShowDropdown(true); // Show dropdown on mouse enter
  };

  const handleMouseLeave = () => {
    setShowDropdown(false); // Hide dropdown on mouse leave
  };

  const handleChangeProfilePicture = () => {
    fileInputRef.current.click(); // Trigger file input
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
            <Link to='/application' className='text-gray-600 hover:text-gray-800'>
              Applied Jobs
            </Link>
            <p className='max-sm:hidden text-gray-600'>|</p>
            <p className='max-sm:hidden text-gray-600'>Hi, {userData ? userData.name : 'User'}</p>
            <div
              className='relative'
              onMouseEnter={handleMouseEnter} // Show dropdown on mouse enter
              onMouseLeave={handleMouseLeave} // Hide dropdown on mouse leave
            >
              <img
                src={userData?.image || assets.profile_img}
                alt='Profile'
                className='w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300'
              />
              {showDropdown && (
                <div className='absolute  top-8 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-100'>
                  <button
                    onClick={handleChangeProfilePicture}
                    className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-100'
                  >
                    Change Profile Picture
                  </button>
                  <button
                    onClick={logout}
                    className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-200'
                  >
                    Logout
                  </button>
                </div>
              )}
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
              />
            </div>
          </div>
        ) : (
          <div className='flex gap-4 max-sm:text-xs'>
            <button
              onClick={handleShowRecruiterLogin}
              className='text-gray-600 hover:text-gray-800'
            >
              Recruiter Login
            </button>
            <button
              onClick={handleShowUserLogin}
              className='bg-gray-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-gray-700'
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