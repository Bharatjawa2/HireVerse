import { User } from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';

// REGISTER USER
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(200).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false
        });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) {
            return res.status(401).json({
                message: "Invalid email or password.",
                success: false
            });
        }

        if (role.toLowerCase() !== user.role.toLowerCase()) {
            return res.status(403).json({
                message: "Role mismatch.",
                success: false
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const newUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200)
            .cookie("token", token, { maxAge: 1*24*60*60*1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back, ${newUser.fullname}!`,
                user: newUser,
                success: true
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during login.",
            success: false
        });
    }
};

// LOGOUT USER
export const logout = async (req, res) => {
    try {
        res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during logout.",
            success: false
        });
    }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        let skillsArray;
        if(skills) skillsArray = skills.split(",");
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;

        await user.save();

        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during profile update.",
            success: false
        });
    }
};
