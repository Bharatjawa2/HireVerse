import express from "express";
import isAuth from "../Middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../Controllers/applicationAuth.js";
const applicationRouter=express.Router();

applicationRouter.route("/apply/job/:id").get(isAuth,applyJob);
applicationRouter.route("/get").get(isAuth,getAppliedJobs);
applicationRouter.route("/:id/applicants").get(isAuth,getApplicants);
applicationRouter.route("/status/:id/update").post(isAuth,updateStatus);

export default applicationRouter;