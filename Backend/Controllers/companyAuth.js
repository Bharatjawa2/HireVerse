import { Company } from "../Models/Company.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is Required.",
                success: false
            })
        }
        const company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company by two ID.",
                success: false
            })
        }
        const newCompany = await Company.create({
            name: companyName,
            userID: req.id,
        })

        return res.status(200).json({
            message: "Company registered Successfully.",
            company: newCompany,
            success: true,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userID = req.id;
        const companies = await Company.find({ userID })
        if (!companies) {
            return res.status(400).json({
                message: "Companies not found.",
                success: false,
            })
        }
        return res.status(200).json({
            companies,
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

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
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

export const updateCompany=async(req,res)=>{
    try {
        const{name,description,website,location,logo}=req.body;
        const file=req.file; // for logo
        // Cloudinary here.
        const companyId=req.params.id;
        const updateData={name,description,website,location,logo};
        const company=await Company.findByIdAndUpdate(companyId,updateData,{new:true});
        if(!companyId){
            return res.status(400).json({
                message: "Companies not found.",
                success: false
            }) 
        }

        return res.status(200).json({
            message:"Company Information updated.",
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