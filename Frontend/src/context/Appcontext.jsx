import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userToken, setUserToken] = useState(null); 
  const [userData, setUserData] = useState(null);

  const [showLogin, setShowLogin] = useState(false);
  const [userApplications, setUserApplications] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/jobs`, {withCredentials: true,});
      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/company/company`,{withCredentials: true,});
      if (data.success) {
        setCompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch company data. Please try again."
      );
    }
  };

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/user/user`,{withCredentials: true,});
      if (data.success) {
        setUserData(data.user);
        console.log(data);
      } else {
        toast.error(data.message);
        setUserToken(false);
        setUserData(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch user data. Please try again."
      );
      setUserToken(false);
      setUserData(null);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/user/applications`, {withCredentials:true});
      if (data.success) {
        setUserApplications(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v2/user/check-auth`, {withCredentials: true,});
      if (data.success) {
        setUserToken(true); 
        setUserData(data.user); 
        console.log("User is authenticated:", data.user);
      } else {
        setUserToken(false); 
        setUserData(null); 
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUserToken(false); 
      setUserData(null); 
    }
  };

  const checkCompanyAuthStatus = async () => {
    try {
      const {data} = await axios.get(`${backendUrl}/api/v2/company/check-auth`,{withCredentials:true});
      if (data.success) {
        setCompanyToken(true); 
        setCompanyData(data.company); 
        console.log("Company is authenticated:", data.company);
      } else {
        setCompanyToken(false); 
        setCompanyData(null); 
      }
    } catch (error) {
      console.error("Error checking company auth status:", error);
      setCompanyToken(false); 
      setCompanyData(null); 
    }
  };

  useEffect(() => {
    checkAuthStatus(); 
    checkCompanyAuthStatus();
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
    searchFilter,setSearchFilter,
    isSearched,setIsSearched,
    jobs,setJobs,
    showRecruiterLogin,setShowRecruiterLogin,
    showLogin,setShowLogin,
    userToken,setUserToken,
    userData,setUserData,
    backendUrl,
    companyToken,setCompanyToken,
    companyData,setCompanyData,
    userApplications,setUserApplications,
    fetchUserData,fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};