import express from 'express';
import { getJob, getJobById } from '../Controllers/jobController.js';

const jobRouter=express.Router();

jobRouter.get('/',getJob);
jobRouter.get('/:id',getJobById);


export default jobRouter;