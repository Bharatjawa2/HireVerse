import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import axios from 'axios';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: '',
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showLogin, setShowLogin] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/jobs`, { withCredentials: true });
      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch jobs. Please try again.");
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/company/company`, { withCredentials: true });
      if (data.success) {
        setCompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch company data. Please try again.");
    }
  };

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/user/user`, { withCredentials: true });
      if (data.success) {
        setUserData(data.user);
        console.log(data);
      } else {
        toast.error(data.message);
        // Clear userToken and userData if the request fails
        setUserToken(null);
        setUserData(null);
        Cookies.remove('userToken');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data. Please try again.");
      // Clear userToken and userData if the request fails
      setUserToken(null);
      setUserData(null);
      Cookies.remove('userToken');
    }
  };

  const fetchUserApplications=async()=>{
    try {
        const {data}=await axios.get(`${backendUrl}/api/v2/user/applications`,{withCredentials:true})
        if(data.success){
            setUserApplications(data.applications)
        }else{
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message); 
    }
  }

  useEffect(() => {
    const storedCompanyToken = Cookies.get('companytoken');
    const storedUserToken = Cookies.get('userToken');
    console.log("Stored Company Token:", storedCompanyToken);
    console.log("Stored User Token:", storedUserToken);
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }

    if (storedUserToken) {
      setUserToken(storedUserToken);
    }

    fetchJob();
  }, []);

  useEffect(() => {
    if (userToken) {
        fetchUserData();
        fetchUserApplications();
    }
  }, [userToken]);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  const value = {
    searchFilter, setSearchFilter,
    isSearched, setIsSearched,
    jobs, setJobs,
    showRecruiterLogin, setShowRecruiterLogin,
    showLogin, setShowLogin,
    userToken, setUserToken,
    userData, setUserData,
    backendUrl,
    companyToken, setCompanyToken,
    companyData, setCompanyData,
    userApplications, setUserApplications,
    fetchUserData,fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};