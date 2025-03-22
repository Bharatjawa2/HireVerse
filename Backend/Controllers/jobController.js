import JobModel from '../Models/Job.js'

export const getJob = async (req, res) => {
    try {
        const jobs = await JobModel.find({ visible: true })
        .populate({ path: "companyId", select: "-password" });
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No jobs found",
            });
        }
        return res.status(200).json({
            success: true,
            jobs,
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const getJobById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required",
            });
        }
        const job = await JobModel.findById(id)
            .populate({ path: "companyId", select: "-password" });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }
        return res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
