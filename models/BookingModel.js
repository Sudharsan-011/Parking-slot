const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parkingSpaceId: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSpace", required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["booked","cancelled","completed"], default: "booked" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
