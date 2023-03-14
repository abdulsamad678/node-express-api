const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const express = require("express");
const cors = require("cors");
const router = express.Router();
require("dotenv").config();
const connectdb = async () => {
  console.log("here");
  try {
    mongoose.connect("mongodb://localhost:27017/custom");
    console.log("mongodb is connected now");
  } catch (err) {
    console.error(err.message);
  }
};
module.exports = connectdb;

// mongodb://localhost:27017/custom
// mongodb+srv://mongoreact:Hafizhabib123@cluster0.gwmcw.mongodb.net/express-mongo?retryWrites=true&w=majority')
