const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  userId: { type: String, require: true }, 
  roomId: { type: String, require: true }, 
  label: { type: String, require: true },
  startDate: { type: String, require: true },
  endDate: { type: String, require: true },
});

const BookingModel = mongoose.model("booking", BookingSchema);
module.exports = BookingModel;
