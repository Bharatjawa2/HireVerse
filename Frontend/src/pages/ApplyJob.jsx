import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import { AppContext } from '../context/Appcontext'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets} from '../assets/assets'
import moment from 'moment'; 
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import axios from 'axios'

const ApplyJob = () => {
  const navigate=useNavigate();
  const {id}=useParams()
  const [jobData,setJobData]=useState(null)
  const [isAlreadyApplied,setIsAlreadyApplied]=useState(false);
  const {jobs,backendUrl,userData,userApplications,fetchUserApplications}=useContext(AppContext);
  const fetchJob=async()=>{
    try {
      const {data}=await axios.get(`${backendUrl}/api/v2/jobs/${id}`,{withCredentials:true})
      if(data.success){
        setJobData(data.job)
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message); 
    }
  }

  const applyHandler=async()=>{
    try {
      if(!userData){
        return toast.error('Login to apply for Jobs');
      }
      if(!userData.resume){
        navigate('/application');
        return toast.error('Upload resume to apply.');        
      }
      const {data}=await axios.post(`${backendUrl}/api/v2/user/apply`,{jobId:jobData._id},{withCredentials:true});
      if(data.success){
        toast.success(data.message);
        fetchUserApplications()
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const checkAlreadyApplied=()=>{
    const hasApplied=userApplications.some(item=>item.jobId._id===jobData._id)
    setIsAlreadyApplied(hasApplied);
  }

  useEffect(()=>{
    if(userApplications.length>0 && jobData){
      checkAlreadyApplied()
    }
  },[jobData,userApplications,id])

  useEffect(()=>{
      fetchJob()
  },[id])

  return jobData ?
  (
    <>
      <Navbar/>
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
        <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-slate-100 border border-gray-500 rounded-xl'>

            <div className='flex flex-col md:flex-row items-center'>
              <img className='h-24 bg-white p-4 rounded-lg mr-4 max-md:mb-4 border border-gray-300' src={jobData.companyId.image} alt=""/>
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='font-medium text-2xl sm:text-4xl'>{jobData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-6 gap-6 items-center mt-2 text-gray-600'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt=""/>
                    {jobData.companyId.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt=""/>
                    {jobData.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt=""/>
                    {jobData.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt=""/>
                    CTC: {jobData.salary}<p>LPA</p>
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyHandler} className='bg-gray-500 hover:bg-gray-600 text-white rounded px-6 py-2 m-1 font-medium transition cursor-pointer'>{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
              <p className='mt-1 mr-3 text-gray-600'>Posted {moment(jobData.date).fromNow()}</p>
            </div>
          </div>


          <div className='flex flex-col lg:flex-row justify-between items-start'>
            {/* left section */}
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job description</h2>
              <div className='rich-text' dangerouslySetInnerHTML={{__html:jobData.description}}></div>
              <button onClick={applyHandler} className='bg-gray-600  text-white rounded px-6 py-2 m-1 font-medium transition cursor-pointer mt-10'>{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
            </div>
            {/* Right section */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
               <h2> More jobs from {jobData.companyId.name}</h2>
               {jobs.filter(job=>job._id != jobData._id && job.companyId._id === jobData.companyId._id)
               .filter(job=>{
                const appliedjobs=new Set(userApplications.map(app=>app.jobId && app.jobId._id))
                return !appliedjobs.has(job._id)
               }).slice(0,3)
               .map((job,index)=> <JobCard key={index} job={job}/>)
               }
            </div>
          </div>


        </div>
      </div>
        <Footer/>
    </>
  )
  :
  (
    <Loading/>
  )
}

export default ApplyJob