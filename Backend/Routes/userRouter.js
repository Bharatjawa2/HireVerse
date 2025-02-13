import express from 'express';
import {register,login,updateProfile, logout} from '../Controllers/userAuth.js'
import isAuth from '../Middlewares/isAuthenticated.js';
const Router=express.Router();

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/update/profile").post(isAuth,updateProfile);
Router.route("/logout").post(logout);

export default Router