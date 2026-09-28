const prisma = require("../config/prisma");

const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            department,
            location,
            employmentType
        } = req.body;

        if (!title || !description || !department || !employmentType) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, description, department and employment type are required"
            });
        }

        const job = await prisma.job.create({
            data: {
                jobCode: "JOB-" + Date.now(),
                title,
                description,
                department,
                location: location || "Pune",
                employmentType,
                minimumExperience: 0,
                minimumQualification: "B.Tech / B.E. Computer Science",
                openings: 1,
                createdById: req.user.id
            }
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("CREATE JOB ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getJobs = async (req, res) => {
    try {

        const jobs = await prisma.job.findMany({
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        applications: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            jobs
        });

    } catch (error) {

        console.error("GET JOBS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createJob,
    getJobs
};