import React, { useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/Appcontext';
import Cookies from 'js-cookie';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {companyData,setCompanyData,setCompanyToken,backendUrl}=useContext(AppContext);

    const logout = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/v2/company/logout`,{},{ withCredentials: true });
            if (data.success) {
                setCompanyToken(false); 
                setCompanyData(null); 
                navigate('/'); 
            } else {
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(()=>{
        if(companyData){
            navigate('/dashboard/manage-jobs');
        }
    },[companyData])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className='min-h-screen'>
            {/* Navbar */}
            <div className="shadow py-4">
                <div className="px-5 flex justify-between items-center">
                    <img
                        className='max-sm:w-32 cursor-pointer w-50 h-14 object-contain'
                        src={assets.hire}
                        alt=""
                    />
                    {companyData && (
                        <div className="flex gap-3 items-center">
                        <p className='max-sm:hidden'>Welcome, {companyData.name}</p>
                        <div className="relative group">
                            <img
                                className='w-8 border rounded-full border-gray-200'
                                src={companyData.image}
                                alt=""
                            />
                            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                                <ul className='list-none m-0 p-2 bg-white rounded-md border border-gray-100 text-sm'>
                                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-5'>Logout</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    )}
                    
                </div>
            </div>

            <div className="flex">
                {/* Left side */}
                <div className="inline-block min-h-screen border-r-2 border-gray-200">
                    <ul className='flex flex-col items-start pt-5 text-gray-800'>
                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-gray-100 border-r-4 border-gray-500'
                                }`
                            }
                            to='/dashboard/add-job'
                        >
                            <img className='min-w-4' src={assets.add_icon} alt="" />
                            <p className='max-sm:hidden'>Add Job</p>
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-gray-100 border-r-4 border-gray-500'
                                }`
                            }
                            to='/dashboard/manage-jobs'
                        >
                            <img className='min-w-4' src={assets.home_icon} alt="" />
                            <p className='max-sm:hidden'>Manage Applications</p>
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-gray-100 border-r-4 border-gray-500'
                                }`
                            }
                            to='/dashboard/view-applications'
                        >
                            <img className='min-w-4' src={assets.person_tick_icon} alt="" />
                            <p className='max-sm:hidden'>View Applications</p>
                        </NavLink>
                    </ul>
                </div>

                {/* Right side */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet /> {/* For Nested Routing */}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
