const prisma = require("../config/prisma");

const createApplication = async (req, res) => {
    try {
        const { candidateId, jobId } = req.body;

        if (!candidateId || !jobId) {
            return res.status(400).json({
                success: false,
                message: "candidateId and jobId are required"
            });
        }

        const candidate = await prisma.candidate.findUnique({
            where: { id: Number(candidateId) }
        });

        const job = await prisma.job.findUnique({
            where: { id: Number(jobId) }
        });

        if (!candidate || !job) {
            return res.status(404).json({
                success: false,
                message: "Candidate or job not found"
            });
        }

        const application = await prisma.application.create({
            data: {
                applicationCode: "APP-" + Date.now(),
                candidateId: Number(candidateId),
                jobId: Number(jobId)
            },
            include: {
                candidate: true,
                job: true,
                interviews: {
                    include: {
                        feedback: true,
                        interviewer: true
                    }
                },
                offer: true
            }
        });

        res.status(201).json({
            success: true,
            message: "Application created successfully",
            application
        });

    } catch (error) {
        console.error("CREATE APPLICATION ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getApplications = async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            include: {
                candidate: true,
                job: true,
                interviews: {
                    include: {
                        interviewer: true,
                        feedback: true
                    }
                },
                offer: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            applications
        });

    } catch (error) {
        console.error("GET APPLICATIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createApplication,
    getApplications
};