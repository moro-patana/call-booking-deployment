const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  start: { type: String, require: true },
  end: { type: String, require: true },
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: "room",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    }
  ]
});

const BookingModel = mongoose.model("booking", BookingSchema);
module.exports = BookingModel;
