(() => {
  // static/js/utils.js
  var createInput = (type, name, placeholder, className) => {
    const $el = document.createElement("input");
    $el.type = type;
    $el.className = className;
    $el.name = name;
    $el.placeholder = placeholder;
    return $el;
  };
  function ingredientsInputBoxes(el) {
    const $inputDiv = document.querySelector(`${el} #ingredients_div`);
    const $inputs = $inputDiv.querySelectorAll(".ingredient_name");
    $inputs[$inputs.length - 1].addEventListener(
      "focusout",
      () => {
        const ingredientName = createInput(
          "text",
          `ingredient_name`,
          "name of ingredient",
          "ingredient_name"
        );
        const ingredientAmount = createInput(
          "text",
          `ingredient_amount`,
          "amount of ingredient",
          "ingredient_amount"
        );
        $inputDiv.appendChild(ingredientName);
        $inputDiv.appendChild(ingredientAmount);
        ingredientsInputBoxes(el);
      },
      { once: true }
    );
  }

  // static/js/main.js
  var API_URL = "http://localhost:6969/api/recipes";
  buildUI();
  async function buildUI() {
    await showFilters();
    await fetchRecipes(showRecipes);
    await POSTRecipe();
  }
  async function fetchRecipes(callBack = null) {
    let data = await fetch(`${API_URL}`);
    data = await data.json();
    if (callBack !== null) {
      callBack(data);
    } else {
      return data;
    }
  }
  async function showFilters() {
    const filters = ["categories", "ingredients", "difficulty"];
    const recipes = await fetchRecipes();
    for (const filter of filters) {
      const $filter = document.getElementById(filter);
      const $filterContent = document.getElementById(`${filter}-content`);
      let filteredItems = await fetch(`${API_URL}/${filter}`);
      filteredItems = await filteredItems.json();
      let html = "";
      for (const filteredItem of filteredItems) {
        html += `<p id="${filteredItem}">${filteredItem}</p>`;
      }
      html += `<p id='${filter}-all'>ALL</p>`;
      $filterContent.innerHTML = html;
      $filter.addEventListener("click", () => {
        $filterContent.classList.toggle("visible");
        $filter.classList.toggle("visible");
      });
      for (const filteredItem of filteredItems) {
        const $filteredItem = document.getElementById(filteredItem);
        $filteredItem.addEventListener("click", () => {
          showRecipes(recipes, filter, filteredItem);
        });
      }
      const $filterItem = document.getElementById(`${filter}-all`);
      $filterItem.addEventListener("click", () => {
        console.log("click");
        showRecipes(recipes);
      });
    }
  }
  function showRecipes(data, filterProperty = "", filterData = "") {
    let $recipes = document.getElementById("recipes");
    let html = "";
    if (filterProperty === "categories") {
      data = data.filter((recipe) => recipe.category === filterData);
    } else if (filterProperty === "ingredients") {
      data = data.filter(
        (recipe) => recipe.ingredients.some(
          (ingredient) => ingredient.name.toLowerCase() === filterData.toLowerCase()
        )
      );
    } else if (filterProperty === "difficulty") {
      data = data.filter((recipe) => recipe.difficulty === filterData);
    }
    data.forEach((recipe) => {
      html += `<a href="detail.html?id=${recipe.id}" id="${recipe.title}" class="card">
    <h2>${recipe.title}</h2>
    <img src="static/media/images/${recipe.image}" alt="image of the recipe">
    <p>This recipe is for ${recipe.servings} people</p>
    <p>difficulty: ${recipe.difficulty}</p>
    </a>`;
    });
    $recipes.innerHTML = html;
  }
  async function POSTRecipe() {
    const $answer = document.getElementById("message_Added_Recipe");
    const $form = document.getElementById("Add_Recipe");
    ingredientsInputBoxes("#Add_Recipe");
    $form.addEventListener("submit", async () => {
      const formData = new FormData($form);
      const ingredientsNameEl = formData.getAll("ingredient_name");
      const ingredientsAmountEl = formData.getAll("ingredient_amount");
      let bodyObj = {};
      formData.forEach((value, k) => {
        if (k !== "ingredient_name" || k !== "ingredient_amount" || k !== "") {
          bodyObj[k] = value;
          console.log(k, value);
        }
      });
      let ingredients = [];
      ingredientsNameEl.forEach((val, k) => {
        if (ingredientsNameEl[ingredientsNameEl.length - 1] !== val) {
          ingredients.push({
            name: val.value,
            amount: ingredientsAmountEl[k].value
          });
        }
      });
      bodyObj += {
        image: "imageLess.webp",
        ingredients
      };
      console.log(bodyObj);
      await fetch(API_URL, {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(bodyObj)
      }).then((response) => response.json()).then((response) => response = $answer.innerHTML = response.message).catch((error) => console.error(error.message));
    });
  }
})();
