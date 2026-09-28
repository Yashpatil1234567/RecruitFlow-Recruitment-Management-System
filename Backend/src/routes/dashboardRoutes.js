const express = require("express");

const { getDashboard } = require("../controllers/dashboardController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("HR"),
    getDashboard
);

module.exports = router;