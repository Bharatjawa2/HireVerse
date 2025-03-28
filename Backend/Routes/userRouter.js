import express from 'express';
import { applyForJob, checkAuthStatus, getUserData, getUserJobApplications, login, logout, register, updateProfilePicture, updateUserResume } from '../Controllers/userController.js';
import upload from '../config/multer.js';
import { isUserAuth } from '../Middlewares/isAuth.js';

const userRouter=express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/logout',isUserAuth,logout);
userRouter.get('/user',isUserAuth,getUserData);
userRouter.post('/apply',isUserAuth,applyForJob);
userRouter.get('/applications',isUserAuth,getUserJobApplications);
userRouter.post('/update-resume',upload.single('resume'),isUserAuth,updateUserResume);
userRouter.get('/check-auth', isUserAuth, checkAuthStatus);
userRouter.post('/update-profile-picture', upload.single('file'),isUserAuth,updateProfilePicture);

export default userRouter;
