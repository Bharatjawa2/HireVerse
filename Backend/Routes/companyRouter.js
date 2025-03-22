import express from 'express';
import { changeJobApplicantsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../Controllers/companyController.js';
import upload from '../config/multer.js';
import { isCompanyAuth } from '../Middlewares/isAuth.js';


const companyRouter = express.Router();

companyRouter.post('/register', upload.single('image'), registerCompany);
companyRouter.post('/login', loginCompany);
companyRouter.get('/company',isCompanyAuth, getCompanyData);
companyRouter.post('/post-job',isCompanyAuth, postJob);
companyRouter.get('/applicants',isCompanyAuth,getCompanyJobApplicants);
companyRouter.get('/list-jobs',isCompanyAuth,getCompanyPostedJobs);
companyRouter.post('/change-status',changeJobApplicantsStatus);
companyRouter.post('/change-visiblity',isCompanyAuth,changeVisibility);


export default companyRouter;
 