export const createInput = (type, name, placeholder, className) => {
  const $el = document.createElement("input");

  $el.type = type;
  $el.className = className;
  $el.name = name;
  $el.placeholder = placeholder;

  return $el;
};

export function filterObject(obj) {
  obj = Object.fromEntries(
    Object.keys(obj)
      .filter((k) => obj[k] !== "")
      .map((k) => [k, obj[k]])
  );
  console.log(obj);

  return obj;
}

export function ingredientsInputBoxes(el) {
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

      // Append new inputs to the container
      $inputDiv.appendChild(ingredientName);
      $inputDiv.appendChild(ingredientAmount);

      ingredientsInputBoxes(el);
    },
    { once: true }
  );
}
