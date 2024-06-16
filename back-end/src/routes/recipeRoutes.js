const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeControllers");

router.get("/recipes/categories", recipeController.getCategories);
router.get("/recipes/ingredients", recipeController.getIngredients);
router.get("/recipes/difficulty", recipeController.getDifficulty);
router.get("/recipes", recipeController.getRecipes);
router.get("/recipes/:id", recipeController.getRecipes);
router.post("/recipes", recipeController.addRecipe);
router.put("/recipes/:id", recipeController.editRecipe);
router.delete("/recipes/:id", recipeController.removeRecipe);

module.exports = router;
