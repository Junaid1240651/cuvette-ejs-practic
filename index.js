const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const Recipe = require("./mongoDB/recipeSchema");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));

const url = process.env.mongoUrl;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("./public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
  const recipes = await Recipe.find();
  res.render("homePage", { recipes });
});
app.get("/addRecipe", (req, res) => {
  res.render("addRecipe");
});
app.post("/addRecipe", upload.single("recipeImage"), async (req, res) => {
  console.log(req.file.filename);
  try {
    const recipe = new Recipe({
      name: req.body.recipeName,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      img: req.file.filename,
    });
    await recipe.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error creating recipe:", err.message);
    res.status(500).send("Server Error");
  }
});
app.get("/:id/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.render("editRecipe", { recipe });
  } catch (err) {
    console.error("Error getting recipe:", err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/:id/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    recipe.name = req.body.recipeName;
    recipe.description = req.body.description;
    recipe.ingredients = req.body.ingredients;
    recipe.steps = req.body.steps;
    await recipe.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error updating recipe:", err.message);
    res.status(500).send("Server Error");
  }
});
app.post("/:id/delete", async (req, res) => {
  console.log(req.params.id);

  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting recipe:", err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(3000, () => {
  console.log("connected");
});
