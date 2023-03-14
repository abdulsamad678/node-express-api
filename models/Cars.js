const mongoose = require('mongoose');
const newschema= new mongoose.Schema({
    name:{
      type:String,
      required:true,
      unique:true
  },
  })
  module.exports=mongoose.model('car',newschema);