import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { connectCloudinary } from './config/cloudinary.js';
import cookieParser from 'cookie-parser';
import companyRouter from './Routes/companyRouter.js';
import jobRouter from './Routes/jobRouter.js';
import userRouter from './Routes/userRouter.js';

// Initialise Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost:5173','https://hireverse.vercel.app'],
    credentials: true
};
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => res.send('API Working'));
app.use('/api/v2/user',userRouter);
app.use('/api/v2/company', companyRouter);
app.use('/api/v2/jobs', jobRouter);

// Connect to DB & Cloudinary Before Starting Server
await connectCloudinary();
await connectDB();

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
