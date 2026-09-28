const express = require("express");

const {
    createCandidate,
    getCandidates
} = require("../controllers/candidateController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("HR"),
    createCandidate
);

router.get(
    "/",
    authenticate,
    authorize("HR"),
    getCandidates
);

module.exports = router;