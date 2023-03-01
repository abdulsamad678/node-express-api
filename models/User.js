const mongoose = require('mongoose');
const newschema= new mongoose.Schema({
    name:{
      type:String,
      required:true,
      unique:true
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  password:{
    type:String,
    required:true
  },
  is_active:{
    type:Boolean,
    default:false
  }
  })
  module.exports=mongoose.model('user',newschema);