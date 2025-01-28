import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MONGODB connected Successfully.")
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;

// MONGODB_URL=mongodb+srv://jawabharat05:oZAXL9QTEWe6SWx9@cluster0.lcaet.mongodb.net/
// PORT=8080