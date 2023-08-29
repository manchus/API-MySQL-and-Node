const mongoose = require('mongoose');

const produitsSchema = new mongoose.Schema({
  compagnie: String,
  brand: String,
  price: Number, 
})
module.exports = mongoose.model('produit', produitsSchema );