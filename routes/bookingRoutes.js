const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/bookingController");

router.post("/create", bookingCtrl.createBooking);
router.get("/all", bookingCtrl.listBookings);

module.exports = router;
