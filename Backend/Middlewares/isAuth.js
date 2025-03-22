import jwt from "jsonwebtoken";
import companyModel from "../Models/Company.js";
import UserModel from "../Models/User.js";

export const isCompanyAuth = async (req, res, next) => {
    const token = req.cookies.companytoken; 
    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token provided",
            success: false,
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.company = await companyModel.findById(decoded.id).select("-password");
        if (!req.company) {
            return res.status(401).json({
                message: "Not authorized, company not found",
                success: false,
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token",
            success: false,
        });
    }
};


export const isUserAuth = async (req, res, next) => {
    const token = req.cookies.userToken;
    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token provided",
            success: false,
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized, User not found",
                success: false,
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token",
            success: false,
        });
    }
};
