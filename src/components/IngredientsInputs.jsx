import React, { useContext } from "react";
import { formContext } from "../pages/RecipeForm";

const IngredientsInputs = () => {
  const { ingredients, setIngredients } = useContext(formContext);
  // structure d'un ingrédient [{name:"Farine", quantity:"15", unity: "gr"}, ...]

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unity: "" }]);
  };

  const handleIngredientChange = (index, value, key) => {
    const newIngredients = [...ingredients];
    newIngredients[index][key] = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const increaseQuantity = (index) => {
    const newIngredients = [...ingredients];
    newIngredients[index].quantity = (newIngredients[index].quantity || 0) + 1;
    setIngredients(newIngredients);
  };

  const decreaseQuantity = (index) => {
    const newIngredients = [...ingredients];
    newIngredients[index].quantity = Math.max(
      (newIngredients[index].quantity || 0) - 1,
      0
    );
    setIngredients(newIngredients);
  };

  return (
    <div className="input-container">
      <label className="label-ingredients">Ingredients : </label>
      {ingredients.length == 0 && (
        <p className="not-ingredient-msg">No ingredients yet</p>
      )}
      {ingredients.map((ingredient, index) => (
        <div key={index} className="input-ingredient-container">
          <p>{index + 1}.</p>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, e.target.value, "name")
            }
            placeholder={`Ingredient`}
            required
          />

          <div className="custom-number-input">
            <input
              type="number"
              step="any"
              min="0"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, e.target.value, "quantity")
              }
              placeholder="Quantity"
              required
            />
            <p className="plus-minus">
              <span onClick={() => decreaseQuantity(index)}>-</span>/
              <span onClick={() => increaseQuantity(index)}>+</span>
            </p>
          </div>

          <input
            className="ingredient-unity-input"
            type="text"
            value={ingredient.unity}
            onChange={(e) =>
              handleIngredientChange(index, e.target.value, "unity")
            }
            placeholder="Unity"
            required
          />

          <button type="button" onClick={() => handleRemoveIngredient(index)}>
            X
          </button>
        </div>
      ))}
      <button
        className="add-ingredient-btn"
        type="button"
        onClick={handleAddIngredient}
      >
        ADD
      </button>
    </div>
  );
};

export default IngredientsInputs;
