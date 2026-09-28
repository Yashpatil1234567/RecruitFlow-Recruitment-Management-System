const prisma = require("../config/prisma");

const getDashboard = async (req, res) => {
    try {
        const jobs = await prisma.job.count();
        const candidates = await prisma.candidate.count();
        const applications = await prisma.application.count();
        const interviews = await prisma.interview.count();
        const offers = await prisma.offer.count();

        res.json({
            success: true,
            data: {
                jobs,
                candidates,
                applications,
                interviews,
                offers
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getDashboard };