const express = require("express");

const {
    createInterview,
    getInterviews,
    createFeedback
} = require("../controllers/interviewController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, authorize("HR"), createInterview);

router.get(
    "/",
    authenticate,
    authorize("HR", "INTERVIEWER"),
    getInterviews
);

router.post(
    "/feedback",
    authenticate,
    authorize("INTERVIEWER"),
    createFeedback
);

module.exports = router;