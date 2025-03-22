import jwt from "jsonwebtoken";
import companyModel from "../Models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../Utils/generateTokens.js";
import JobModel from "../Models/Job.js";
import applicationModel from "../Models/Application.js";

// Register company
export const registerCompany = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imageFile = req.file;
        if (!name || !email || !password || !imageFile) {
            return res.status(400).json({
                message: "All fields are required, including the company logo.",
                success: false,
            });
        }
        const companyExists = await companyModel.findOne({ email });
        if (companyExists) {
            return res.status(400).json({
                message: "Email already exists.",
                success: false,
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        if (!imageUpload || !imageUpload.secure_url) {
            return res.status(500).json({
                message: "Failed to upload company logo.",
                success: false,
            });
        }
        const newCompany = new companyModel({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url,
        });
        await newCompany.save();
        const companyToken = generateToken(newCompany._id);
        res.cookie("companytoken", companyToken, {
            secure: process.env.NODE_ENV === "production", 
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        return res.status(201).json({
            company: {
                id: newCompany._id,
                name: newCompany.name,
                email: newCompany.email,
                image: newCompany.image,
            },
            companyToken,
            message: "Recruiter account created successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error in registerCompany:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Company Login
export const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }
        const company = await companyModel.findOne({ email });
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }
        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials.",
                success: false,
            });
        }
        const companyToken = generateToken(company._id)
        res.cookie("companytoken", companyToken, {
            secure: process.env.NODE_ENV === "production", 
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            companyToken,
            message: "Login successful.",
            success: true,
        });
    } catch (error) {
        console.error("Error in loginCompany:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};


export const getCompanyData = async (req, res) => {
    try {
        const company=req.company
        if (!company) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. Company not found.",
            });
        }
        return res.status(200).json({
            success: true,
            company: company,
        });
    } catch (error) {
        console.error("Error fetching company data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const postJob = async (req, res) => {
    try {
        const { title, description, location, salary, category, level } = req.body;

        if (!title || !description || !location || !salary || !category || !level) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const companyId = req.company._id; // Get company ID from isCompanyAuth middleware

        const newJob = new JobModel({
            title,
            description,
            location,
            salary,
            category,
            level,
            companyId,
            date: Date.now(), // Store the job posting date
        });

        await newJob.save();

        return res.status(201).json({
            message: "Job posted successfully",
            success: true,
            job: newJob,
        });
    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};    


export const getCompanyJobApplicants=async(req,res)=>{
    try {
        const companyId = req.company._id;
        const applications=await applicationModel.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()

        return res.status(200).json({
            success:true,
            applications 
        })
    } catch (error) {
        console.error("Error Getting Applicants:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getCompanyPostedJobs = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. Company not found.",
            });
        }

        const companyId = req.company._id;
        const jobs = await JobModel.find({ companyId });

        const jobsData = await Promise.all(
            jobs.map(async (job) => {
                const applicants = await applicationModel.find({ jobId: job._id });
                return { ...job.toObject(), applicants: applicants.length };
            })
        );
        res.status(200).json({
            success: true,
            jobsData: jobsData || [], 
        });
    } catch (error) {
        console.error("Error fetching company jobs:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const changeJobApplicantsStatus=async(req,res)=>{
    try {
        const {id,status}=req.body
        await applicationModel.findByIdAndUpdate({_id:id},{status})
        res.status(200).json({
            success:true,
            message:'Status Changed'
        })
    }catch(error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


export const changeVisibility = async (req, res) => {
    try {
        const { id } = req.body;
        const companyId = req.company._id;
        
        const job = await JobModel.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        if (companyId.toString() !== job.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to change visibility",
            });
        }

        job.visible = !job.visible;

        await job.save();

        res.status(200).json({
            success: true,
            message: "Visibility changed successfully",
            job,
        });

    } catch (error) {
        console.error("Error changing visibility:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
