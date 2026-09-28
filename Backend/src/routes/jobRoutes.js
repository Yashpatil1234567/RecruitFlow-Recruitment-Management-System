const express = require("express");

const {
    createJob,
    getJobs
} = require("../controllers/jobController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();


router.post(
    "/",
    authenticate,
    authorize("HR"),
    createJob
);


router.get(
    "/",
    authenticate,
    authorize("HR"),
    getJobs
);


module.exports = router;