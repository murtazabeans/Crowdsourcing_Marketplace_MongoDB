var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
  id: String,
  user_id: String,
  created_at: Date,
  amount: Number,
  transaction_type: String,
  description: String
});

module.exports = mongoose.model("Payment", PaymentSchema);
