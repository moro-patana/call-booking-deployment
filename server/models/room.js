const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
});

const RoomModel = mongoose.model("room", RoomSchema);
module.exports = RoomModel;