const Booking = require("../models/BookingModel");

// create booking
exports.createBooking = async (req, res) => {
  try {
    const b = await Booking.create(req.body);
    res.status(201).json({ message: "Booking created", data: b });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// list bookings (for admin or user)
exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId parkingSpaceId");
    res.json({ count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
