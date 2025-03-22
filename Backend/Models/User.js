import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String, 
        default: "",  
    },
    resume: {
        type: String, 
        default: "", 
    }
},{ timestamps: true });

const UserModel = mongoose.model("user_2", userSchema);
export default UserModel;
