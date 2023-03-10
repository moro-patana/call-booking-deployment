const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  access_token: { type: String, require: true },
  picture: { type: String, require: true },
  hd: { type: String, require: true },
  expires_in: { type: Number, require: true }
});

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
