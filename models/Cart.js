const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

  cartUser:{
    type:String,
    required:true
  },

  courseIds:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Course",
  }]
})

module.exports = mongoose.model("Cart", cartSchema);

