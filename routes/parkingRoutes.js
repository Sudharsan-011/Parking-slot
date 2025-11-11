const express = require("express");
const {
  createParkingSpace,
  getAvailableParkingSpaces,
  updateParkingSpace,
  deleteParkingSpace,
  searchParking
} = require("../controllers/parkingController");

const router = express.Router();

// Public
router.get("/available", getAvailableParkingSpaces);
router.get("/search", searchParking);

// (Auth can be added later; keeping it simple for now)
router.post("/create", createParkingSpace);
router.put("/:id", updateParkingSpace);
router.delete("/:id", deleteParkingSpace);

module.exports = router;
