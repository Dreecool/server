const mongoose = require("mongoose");


const RegisterSchema = new mongoose.Schema({

  full_name: {
    type: String,
    required: true
  },

  email_address: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }

  

  
})


const Register = mongoose.model("Register", RegisterSchema);

module.exports = Register