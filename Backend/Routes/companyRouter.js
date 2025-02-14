import express from 'express';
import isAuth from '../Middlewares/isAuthenticated.js';
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../Controllers/companyAuth.js';
const companyRouter=express.Router();

companyRouter.route("/register").post(isAuth,registerCompany);
companyRouter.route("/get").get(isAuth,getCompany);
companyRouter.route("/get/:id").get(isAuth,getCompanyById);
companyRouter.route("/update/:id").put(isAuth,updateCompany);

export default companyRouter