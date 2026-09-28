const prisma = require("../config/prisma");

const createCandidate = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            qualification,
            experienceYears,
            location
        } = req.body;

        if (
            !fullName ||
            !email ||
            !phone ||
            !qualification ||
            experienceYears === undefined ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "All candidate fields are required"
            });
        }

        const candidate = await prisma.candidate.create({
            data: {
                candidateCode: "CAN-" + Date.now(),
                fullName,
                email,
                phone,
                qualification,
                experienceYears: Number(experienceYears),
                location
            }
        });

        res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            candidate
        });

    } catch (error) {
        console.error("CREATE CANDIDATE ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCandidates = async (req, res) => {
    try {
        const candidates = await prisma.candidate.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            candidates
        });

    } catch (error) {
        console.error("GET CANDIDATES ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCandidate,
    getCandidates
};