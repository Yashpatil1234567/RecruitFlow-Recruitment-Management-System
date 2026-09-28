const prisma = require("../config/prisma");

const createInterview = async (req, res) => {
    try {
        const {
            applicationId,
            interviewerId,
            interviewRound,
            interviewType,
            scheduledDate,
            scheduledTime,
            meetingLink
        } = req.body;

        const interview = await prisma.interview.create({
            data: {
                applicationId: Number(applicationId),
                interviewerId: Number(interviewerId),
                interviewRound,
                interviewType,
                scheduledDate: new Date(scheduledDate),
                scheduledTime,
                meetingLink: meetingLink || null
            }
        });

        res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            interview
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInterviews = async (req, res) => {
    try {
        const interviews = await prisma.interview.findMany({
            include: {
                application: {
                    include: {
                        candidate: true,
                        job: true
                    }
                },
                interviewer: true,
                feedback: true
            }
        });

        res.json({
            success: true,
            interviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createFeedback = async (req, res) => {
    try {
        const {
            interviewId,
            technicalRating,
            communicationRating,
            problemSolvingRating,
            overallRating,
            strengths,
            weaknesses,
            recommendation,
            comments
        } = req.body;

        const feedback = await prisma.interviewFeedback.create({
            data: {
                interviewId: Number(interviewId),
                technicalRating: Number(technicalRating),
                communicationRating: Number(communicationRating),
                problemSolvingRating: Number(problemSolvingRating),
                overallRating: Number(overallRating),
                strengths: strengths || null,
                weaknesses: weaknesses || null,
                recommendation,
                comments: comments || null
            }
        });

        await prisma.interview.update({
            where: { id: Number(interviewId) },
            data: { status: "COMPLETED" }
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createInterview,
    getInterviews,
    createFeedback
};