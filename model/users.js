var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  phone_number: String,
  about_me: String,
  skills: String,
  created_at: Date,
  profile_image_name: String,
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", UsersSchema);