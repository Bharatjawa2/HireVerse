import express from 'express';
import isAuth from '../Middlewares/isAuthenticated.js';
import { getAdminJob, getAllJobs, getJobById, postJob } from '../Controllers/jobAuth.js';

const JobRouter=express.Router();

JobRouter.route("/post").post(isAuth,postJob);
JobRouter.route("/get").get(isAuth,getAllJobs);
JobRouter.route("/getadminjobs").get(isAuth,getAdminJob);
JobRouter.route("/get/:id").get(isAuth,getJobById);

export default JobRouter