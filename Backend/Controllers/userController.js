import UserModel from '../Models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import generateToken from '../Utils/generateTokens.js';
import JobModel from '../Models/Job.js';
import applicationModel from '../Models/Application.js';
import { v2 as cloudinary } from "cloudinary";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            image: "",
            resume: "",
        });
        const userToken = generateToken(newUser._id);
        res.cookie("userToken", userToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            userToken,
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const userToken = generateToken(user._id);
        res.cookie("userToken", userToken, {
            secure: true, // Required for HTTPS
            sameSite: 'none', // Required for cross-origin cookies
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            domain: '.vercel.app', // Allow cookies to be shared across subdomains
            path: '/', // Make the cookie accessible across all paths
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                resume: user.resume,
            },
            userToken,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// LOGOUT
export const logout = async (req, res) => {
    try {
        res.cookie("userToken", "", {
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const getUserData = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId).select('-password');;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id;
        const isAlreadyApplied = await applicationModel.findOne({ jobId, userId });
        if (isAlreadyApplied) {
            return res.status(200).json({
                success: true,
                message: "You have already applied for this job.",
            });
        }
        const jobData = await JobModel.findById(jobId);
        if (!jobData) {
            return res.status(404).json({
                success: false,
                message: "Job not found.",
            });
        }
        await applicationModel.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now(),
        });
        res.status(200).json({
            success: true,
            message: "Job application submitted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }
};


export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        const applications = await applicationModel.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec();
        res.status(200).json({
            success: true,
            applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }
};


export const updateUserResume = async (req, res) => {
    try {
        const userId = req.user._id;
        const resumeFile = req.file;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
            userData.resume = resumeUpload.secure_url;
            await userData.save();
        }
        res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            resume: userData.resume,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update resume",
            error: error.message,
        });
    }
};


