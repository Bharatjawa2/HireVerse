import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jobsData } from "../assets/assets";

export const AppContext=createContext()

export const AppContextProvider=(props)=>{
    const [searchFilter,setSearchFilter]=useState({
        title:'',
        location:'',
    })
    const [isSearched,setIsSearched]=useState(false);
    const [jobs,setJobs]=useState([]);
    const fetchJob=async()=>{
        setJobs(jobsData);
    }
    useEffect(()=>{
        fetchJob()
    },[]);
    const value={
        searchFilter,setSearchFilter,
        isSearched,setIsSearched,
        jobs,setJobs
    }
    
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}
