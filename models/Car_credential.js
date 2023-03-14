const mongoose = require("mongoose");
const newschema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
    unique: true,
  },
  vehicle: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("cae_credential", newschema);
