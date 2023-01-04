const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  label: { type: String, require: true },
  startDate: { type: String, require: true },
  endDate: { type: String, require: true },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "room",
  },
  partecipants: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    }
  ]
});

const BookingModel = mongoose.model("booking", BookingSchema);
module.exports = BookingModel;
