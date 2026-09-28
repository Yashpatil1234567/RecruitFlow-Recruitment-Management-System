const express = require("express");

const {
    createApplication,
    getApplications
} = require("../controllers/applicationController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("HR"),
    createApplication
);

router.get(
    "/",
    authenticate,
    authorize("HR"),
    getApplications
);

module.exports = router;