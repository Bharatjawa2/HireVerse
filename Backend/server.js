import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; //Cross-Origin Resource Sharing (CORS)
import connectDB from './Utils/db.js';
import dotenv from 'dotenv';// to access Environment variables
import Router from './Routes/userRouter.js';
import companyRouter from './Routes/companyRouter.js';
import JobRouter from './Routes/jobRouter.js';
import applicationRouter from './Routes/applicationRouter.js';
dotenv.config({});

const app=express(); // app is an Instance of Express application created using express()

app.get('/home',(req,res)=>{
    return res.status(400).json({
        message:"hello from backend",
        success:true
    })
})

// Middlewars
app.use(express.json()); //It converts the JSON data in the request body to a JavaScript object.
app.use(express.urlencoded({extended:true})) // parse incoming requests with URL-encoded data , The {extended:true} option allows the parsing of complex objects in the URL-encoded data.
app.use(cookieParser());
const corsOptions={
    origin:'http//localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

// api's
app.use("/api/v1/user",Router)
app.use("/api/v1/company",companyRouter);
app.use("/api/v1/job",JobRouter);
app.use("/api/v1/application",applicationRouter);


const PORT=process.env.PORT || 8000;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on ${PORT}`)
})

