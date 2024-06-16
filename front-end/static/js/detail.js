import { filterObject, ingredientsInputBoxes } from "./utils.js";

const API_URL = "http://localhost:4000/api/recipes";
buildUI();

async function buildUI() {
  await getrecipe(showRecipe);
  await EditRecipe();
  await DelRecipe();
}
function GETID() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function getrecipe(callBack) {
  const id = GETID();

  let recipe = await fetch(`${API_URL}/${id}`);
  recipe = await recipe.json();

  callBack(recipe);
}

function showRecipe(recipe) {
  const $mainEl = document.getElementById("recipe_details");
  $mainEl.innerHTML = `
  <div>
  <img src="static/media/images/${recipe.image}" alt="Image of the dish">
  </div>
  <h1>${recipe.title}</h1>
  <p>Het duurt ${recipe.cookingTime} min om klaar te maken</p>
  <p>Het is een recept voor ${recipe.servings} mensen</p>
  <h2>ingredienten:</h2>
  ${ingredientsDisplay(recipe)}

  <h2>instructies:</h2>
  <p>${instructionsNumberedSteps(recipe.instructions)}</p>
  `;
}

function ingredientsDisplay(recipe) {
  let html = "";
  for (const ingredient of recipe.ingredients) {
    html += `<li>ingredient: ${ingredient.name}, hoeveelheid: ${ingredient.amount}</li>`;
  }
  return `<ul>
  ${html}
  </ul>`;
}

function instructionsNumberedSteps(instructions) {
  let dot = true;
  let counter = 1;
  let html = "";
  for (let i = 0; i < instructions.length; i++) {
    if (dot) {
      html += `<br>${counter}. `;
      if (counter === 1) {
        html += instructions[i];
      }
      counter++;
    } else {
      html += instructions[i];
    }
    if (instructions[i] === ".") {
      dot = true;
    } else {
      dot = false;
    }
  }
  return html;
}

async function EditRecipe() {
  const $answer = document.getElementById("message_Edited_recipe");
  const $form = document.getElementById("Edit_Recipe");
  ingredientsInputBoxes("#Edit_Recipe");
  
  $form.addEventListener("submit", async (e) => {
    const id = GETID();
    e.preventDefault();
    let ingredients = [];
    const ingredientsNameEl = $form.querySelectorAll(".ingredient_name");
    const ingredientsAmountEl = $form.querySelectorAll(".ingredient_amount");
    const formData = new FormData($form);

    if (ingredientsNameEl) {
      ingredientsNameEl.forEach((val, k) => {
        if (ingredientsNameEl[ingredientsNameEl.length - 1] !== val) {
          ingredients.push({
            name: val.value,
            amount: ingredientsAmountEl[k].value,
          });
        }
      });
    }

    let bodyObj = {id:id};

    formData.forEach((value, k) => {
      bodyObj[k] = value;
    });

    const filteredObject = filterObject(bodyObj);

    if (ingredients.length > 0) {
      filteredObject.ingredients = ingredients;
    }

    console.log(filteredObject);
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(filteredObject),
    })
      .then((response) => (response = response.json()))
      .then((response) => ($answer.innerHTML = response.message))
      .catch((error) => console.error(error.message));
  });
}

async function DelRecipe() {
  
  document.getElementById("delete_recipe").addEventListener("click", async (e) => {
    const id = GETID();

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((response) => (response = response.json()))
      .then((response) => alert(response.message))
      .catch((error) => console.error(error.message));
  });
}
