import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/Hireverse`);
        console.log("MONGODB connected Successfully.")
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;

