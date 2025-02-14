import { Job } from "../Models/Job.js";

// admin post krege
export const postJob=async(req,res)=>{
    try {
        const {title,description,requirements,salary,location,jobType,experience,position,companyId}=req.body;
        const userID=req.id;
        if(!title || !description || !requirements || !salary || !location || !experience || !jobType || !position || !companyId){
            return res.status(400).json({
                message:"Something is missing.",
                success:false
            })
        }
        const job=await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userID
        })

        return res.status(200).json({
            message:"Job created Successfully.",
            job,
            success:true
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false
        });
    }
}

// student k liye
export const getAllJobs=async(req,res)=>{
    try {
        const keyword=req.query.keyword || "";
        const query={
            $or:[
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
            ]
        }
        const jobs=await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});
        if(!jobs){
            return res.status(400).json({
                message:"Jobs not found.",  
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false
        });
    }
}

//student
export const getJobById=async(req,res)=>{
    try {
        const jobId=req.params.id;
        const job=await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                message:"Job not found.",
                success:false
            })
        }
        return res.status(200).json({
            job,
            success:true
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false
        });
    }
}

// admin kitne job post kr chuka hai abhi tk
export const getAdminJob=async(req,res)=>{
    try {
        const adminID=req.id;
        const jobs=await Job.find({created_by:adminID });
        if(!jobs){
            return res.status(400).json({
                message:"Jobs not found.",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    }catch(error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false
        });
    }
}