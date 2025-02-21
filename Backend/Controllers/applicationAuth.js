import { Application } from "../Models/Application.js";
import { Job } from "../Models/Job.js";

export const applyJob=async(req,res)=>{
    try {
        const userID=req.id;
        const jobId=req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job id is required.",
                success:false
            })
        }
        //check if user has already registered for this job
        const existingApplication=await Application.findOne({job:jobId, applicant:userID});
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job.",
                success:false,
            })
        }
        // check if job exist or not
        const job=await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                message:"Job not found.",
                success:false
            })
        }
        //create a new application
        const newapplication=await Application.create({
            job:jobId,
            applicant:userID,
        })

        job.applications.push(newapplication._id);
        await job.save();

        return res.status(200).json({
            message:"Application applied Successfully.",
            success:true,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false
        });
    }
}

export const getAppliedJobs=async(req,res)=>{
    try {
        const userId=req.id;
        const application=await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        
        if(!application){
            return res.status(404).json({
                message:"No Application ",
                success:false
            })
        }
        return res.status(200).json({
            application,
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

export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus=async(req,res)=>{
    try {
        const {status}=req.body;
        const applicationId=req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Status is Required.",
                success:false
            })
        }
        const application=await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(401).json({
                message:"Application not found.",
                success:false,
            })
        }

        application.status=status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status Updated.",
            success:true,
        })
     } catch (error) {
        
    }
}