import mongoose from "mongoose";

const jobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    level:{
        type:String,
        required:true,
    },
    salary:{
        type:Number,
        required:true,
    },
    date:{
        type:Number,
        required:true,
    },
    visible:{
        type:Boolean,
        default :true,
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'company_2',
        required:true,
    }
},{ timestamps: true })

const JobModel=mongoose.model('Job_2',jobSchema);
export default JobModel;