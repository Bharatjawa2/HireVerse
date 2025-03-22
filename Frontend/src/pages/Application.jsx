import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Application = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { backendUrl, userData, userApplications, fetchUserData } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData();
        setIsLoading(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUserData]);

  const updatedResume = async () => {
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      const { data } = await axios.post(`${backendUrl}/api/v2/user/update-resume`, formData, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsEdit(false);
    setResume(null);
  };

  if (isLoading) {
    return <p>Loading...</p>; 
  }

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:p-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit || (userData && userData.resume === '') ? (
            <>
              <label className='flex items-center' htmlFor='resumeUpload'>
                <p className='bg-gray-100 text-gray-600 px-4 py-2 rounded-lg mr-2'>
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id='resumeUpload'
                  onChange={(e) => setResume(e.target.files[0])}
                  accept='application/pdf'
                  type='file'
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="" />
              </label>
              <button onClick={updatedResume} className='bg-green-50 border border-gray-200 text-green-400 px-4 py-2 rounded cursor-pointer'>
                Save
              </button>
            </>
          ) : (
            <div className='flex gap-2'>
              {userData && userData.resume ? (
                <a href={userData.resume} target='_blank' rel='noopener noreferrer' className='bg-gray-200 text-gray-900 px-4 py-2 rounded-lg'>
                  Resume
                </a>
              ) : (
                <p className='bg-gray-200 text-gray-900 px-4 py-2 rounded-lg'>No resume uploaded</p>
              )}
              <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Applied Jobs */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
          <table className='min-w-full border border-gray-300 rounded-lg bg-white'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b border-gray-300 text-left'>Company</th>
                <th className='py-3 px-4 border-b border-gray-300 text-left'>Job Title</th>
                <th className='py-3 px-4 border-b border-gray-300 text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b border-gray-300 text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b border-gray-300 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((job, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 flex items-center gap-2 border-b border-gray-300'>
                    <img className='w-8 h-8' src={job.companyId.image} alt='Company Logo' />
                    {job.companyId.name}
                  </td>
                  <td className='px-4 py-2 border-b border-gray-300'>{job.jobId.title}</td>
                  <td className='px-4 py-2 border-b border-gray-300 max-sm:hidden'>{job.jobId.location}</td>
                  <td className='px-4 py-2 border-b border-gray-300 max-sm:hidden'>
                    {moment(job.jobId.date).format('ll')}
                  </td>
                  <td className='px-4 py-2 border-b border-gray-300'>
                    <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Application;