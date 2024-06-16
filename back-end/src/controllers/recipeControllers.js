const fsp = require("fs/promises");
const path = require("path");
const { v4: generateID } = require("uuid");
const recipesFilePath = path.join(__dirname, "..", "data", "recipes.json");

async function readFile() {
  const data = await fsp.readFile(recipesFilePath, "utf-8");
  return JSON.parse(data);
}

async function writeFile(recipes) {
  await fsp.writeFile(recipesFilePath, JSON.stringify(recipes), null, 2);
}

async function getRecipes(request, response) {
  try {
    const { id } = request.params;
    const data = await readFile();

    if (id) {
      const filteredData = data.find((recipe) => recipe.id == id);
      return response.json(filteredData);
    }

    response.json(data);
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
}

async function getCategories(request, response) {
  try {
    const data = await readFile();
    let filteredData = data.map((recipe) => recipe.category);
    filteredData = [...new Set(filteredData.filter((recipe) => recipe))];
    return response.json(filteredData);
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
}

async function getIngredients(request, response) {
  try {
    const data = await readFile();
    let filteredData = data.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.name)
    );
    filteredData = [...new Set(filteredData.filter((recipe) => recipe))];
    return response.json(filteredData);
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
}

async function getDifficulty(request, response) {
  try {
    const data = await readFile();
    let filteredData = data.map((recipe) => recipe.difficulty);
    filteredData = [...new Set(filteredData.filter((recipe) => recipe))];
    return response.json(filteredData);
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
}

async function addRecipe(request, response) {
  try {
    let data = await readFile();
    const body = request.body;
    const id = generateID();
    data.push({
      id: id,
      ...body,
    });

    await writeFile(data);
    response.message = `New recipe added with id: ${id}`;
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
}

async function editRecipe(request, response) {
  // users ophalen uit bestand
  try {
    const { id } = request.params;
    let data = await readFile();

    // recipe id ophalen
    const recipeId = data.findIndex((recipe) => recipe.id == id);
    data[recipeId] = { ...data[recipeId], ...request.body };

    //users bestand opnieuw aanpassen
    await writeFile(data)
    response.message = `recipe with id: ${id} updated.`;
  } catch (error) {
    console.error(error.message);
  }
}

async function removeRecipe(request, response) {
  try {
    const { id } = request.params;
    
    let data = await readFile();

    const filteredData = data.filter((recipe) => recipe.id != id);

    await fsp.writeFile(recipesFilePath, JSON.stringify(filteredData), null, 2);
    response.message = `recept deleted with id: ${id}`;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  getRecipes,
  getCategories,
  getIngredients,
  getDifficulty,
  addRecipe,
  editRecipe,
  removeRecipe,
};
