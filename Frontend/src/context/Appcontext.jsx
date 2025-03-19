import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext=createContext()

export const AppContextProvider=(props)=>{
    const [searchFilter,setSearchFilter]=useState({
        title:'',
        location:'',
    })
    const [isSearched,setIsSearched]=useState(false);
    const [jobs,setJobs]=useState([]);
    const [showRecruiterLogin,setShowRecruiterLogin]=useState(false)

    const [user,setUser]=useState(null);
    const [showLogin,setShowLogin]=useState(false);
    const [token,setToken]=useState(localStorage.getItem('token'))

    const backendUrl=import.meta.env.VITE_BACKEND_URL;


    const fetchJob=async()=>{
        setJobs(jobsData);
    }
    useEffect(()=>{
        fetchJob()
    },[]);
    const value={
        searchFilter,setSearchFilter,
        isSearched,setIsSearched,
        jobs,setJobs,
        showRecruiterLogin,setShowRecruiterLogin,
        showLogin,setShowLogin,
        user,setUser,
        token,setToken,
        backendUrl
    }
    
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}
