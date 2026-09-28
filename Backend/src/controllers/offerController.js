const prisma = require("../config/prisma");

const createOffer = async (req, res) => {
    try {
        const {
            applicationId,
            salary,
            joiningDate,
            notes
        } = req.body;

        if (!applicationId || !salary || !joiningDate) {
            return res.status(400).json({
                success: false,
                message: "Application, salary and joining date are required"
            });
        }

        const offer = await prisma.offer.create({
            data: {
                applicationId: Number(applicationId),
                salary: Number(salary),
                joiningDate: new Date(joiningDate),
                notes: notes || null
            }
        });

        res.status(201).json({
            success: true,
            message: "Offer created successfully",
            offer
        });

    } catch (error) {
        console.error("CREATE OFFER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOffers = async (req, res) => {
    try {
        const offers = await prisma.offer.findMany({
            include: {
                application: {
                    include: {
                        candidate: true,
                        job: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            offers
        });

    } catch (error) {
        console.error("GET OFFERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOffer,
    getOffers
};