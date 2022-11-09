const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  label: { type: String, require: true },
  startDate: { type: String, require: true },
  endDate: { type: String, require: true },
  user: {
    type: Object,
    ref: "user",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "room",
  },
});

const BookingModel = mongoose.model("booking", BookingSchema);
module.exports = BookingModel;
