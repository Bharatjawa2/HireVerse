import mongoose from "mongoose";

const applicationSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'user_2',
        required:true,
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'company_2',
        required:true,
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job_2',
        required:true,
    },
    status:{
        type:String,
        default:'Pending'
    },
    date:{
        type:Number,
        required:true
    }
},{ timestamps: true })

const applicationModel=mongoose.model('Application_2',applicationSchema);
export default  applicationModel