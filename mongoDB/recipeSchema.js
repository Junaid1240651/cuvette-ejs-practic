const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  ingredients: String,
  steps: String,
  img: String,
});
module.exports = mongoose.model("recipeSchema", recipeSchema);
