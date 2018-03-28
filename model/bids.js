var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BidsSchema = new Schema({
  id: String,
  user_id: String,
  project_id: String,
  number_of_days: String,
  created_at: Date,
  assigpricened_to: String,
  status: String
});

module.exports = mongoose.model("Bid", BidsSchema);
