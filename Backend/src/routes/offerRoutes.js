const express = require("express");

const {
    createOffer,
    getOffers
} = require("../controllers/offerController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("HR"),
    createOffer
);

router.get(
    "/",
    authenticate,
    authorize("HR"),
    getOffers
);

module.exports = router;