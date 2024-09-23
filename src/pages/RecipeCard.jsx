import React, { useEffect, useRef, useState } from "react";
import { getPictureUrl, deletePicture } from "../appWrite/storage";
import db from "../appWrite/databases";
import { useLocation, useNavigate } from "react-router-dom";
import animationFunctions from "../utils/animations/animations";
import NoElementHere from "../components/NoElementHere";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const RecipeCard = () => {
  const navigate = useNavigate();
  const [urlPicture, setUrlPicture] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const ingredientsQuantityRefs = useRef([]);
  const recipeCardRef = useRef(null);
  const fixedBtnsRef = useRef(null);
  const [recipe, setRecipe] = useState(null);
  const [numberPeople, setNumberPeople] = useState(1);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { emergence } = animationFunctions;

  const getUrl = async (recipe) => {
    if (recipe.pictureID) {
      const url = await getPictureUrl(recipe.pictureID);
      setUrlPicture(url);
    }
  };

  const handleLoadRecipe = async () => {
    const comingRecipe = location.state?.recipe ?? null;
    if (comingRecipe) {
      await getUrl(comingRecipe);
      const comingIngredients = JSON.parse(comingRecipe.ingredients);
      setIngredients(comingIngredients);
      setNumberPeople(comingRecipe.people);
      setRecipe(comingRecipe);
    }
  };

  useEffect(() => {
    const start = async () => {
      await handleLoadRecipe();

      setTimeout(async () => {
        if (recipeCardRef !== null) {
          await emergence(recipeCardRef.current, true);
          await emergence(fixedBtnsRef.current, true);
        }
      }, 200);
    };

    start();
  }, []);

  const handleQuantityIngredients = (
    initialNumberPeople,
    updatedNumberPeople,
    quantity
  ) => {
    const result = (quantity / initialNumberPeople) * updatedNumberPeople;
    return result.toFixed(1);
  };

  const handleAnimationQuantity = (showUp = true) => {
    return new Promise((resolve, refject) => {
      ingredientsQuantityRefs.current.forEach((ref) => {
        emergence(ref, showUp);
      });
      setTimeout(() => {
        resolve();
      }, 600);
    });
  };

  const handleUpdatedNumberPeople = async (p) => {
    if (numberPeople + p <= 0 || ingredients.length == 0) return;

    await handleAnimationQuantity(false);

    let ingredientsToUpdate = ingredients.map((i) => {
      i.quantity = handleQuantityIngredients(
        numberPeople,
        numberPeople + p,
        i.quantity
      );
      return i;
    });

    setNumberPeople((prev) => prev + p);
    setIngredients(ingredientsToUpdate);

    await handleAnimationQuantity(true);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleExitAnimation = async () => {
    await Promise.all([
      emergence(fixedBtnsRef.current, false),
      emergence(recipeCardRef.current, false),
    ]);
  };

  const deleteRecipe = async () => {
    try {
      await handleExitAnimation();
      setLoading(true);
      if (recipe.pictureID) {
        await deletePicture(recipe.pictureID);
      }
      await db.recipes.delete(recipe.$id);
      sessionStorage.setItem("message", "Recipe deleted successfully!");
    } catch (err) {
      console.error("Failed to delete recipe or picture:", err);
      toast(err.message, {
        className: "toast-error-message",
      });
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  const goToEditRecipe = async () => {
    await handleExitAnimation();
    navigate(`/recipe-form/${recipe.$id}`);
  };

  if (!recipe) {
    return (
      <div className="main-content">
        <div className="recipe-card">
          <h2>Don't no what happend</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="main-content">
      <div ref={recipeCardRef} className="recipe-card" id="recipe-card">
        <h2>{capitalizeFirstLetter(recipe.title)}</h2>

        <div className="first-container">
          <div className="image-container">
            {urlPicture ? (
              <img src={urlPicture} alt="recipe picture" />
            ) : (
              <NoElementHere onClick={goToEditRecipe} element={"picture"} />
            )}
          </div>
          <div className="ingredients-people-container">
            <div className="ingredients-container">
              <h3>Ingredients :</h3>
              {ingredients.length == 0 && (
                <NoElementHere
                  onClick={goToEditRecipe}
                  element={"ingredients"}
                />
              )}
              <ol>
                {ingredients.map((i, index) => (
                  <li key={index}>
                    {index + 1}. {i.name}{" "}
                    <span
                      ref={(el) =>
                        (ingredientsQuantityRefs.current[index] = el)
                      }
                    >
                      {i.quantity}
                    </span>{" "}
                    {i.unity}
                  </li>
                ))}
              </ol>
            </div>
            <div className="people-container">
              <p>
                For {numberPeople} {numberPeople > 1 ? "people" : "person"}
              </p>
              <p className="plus-minus">
                <span onClick={async () => await handleUpdatedNumberPeople(1)}>
                  +
                </span>
                /
                <span onClick={async () => await handleUpdatedNumberPeople(-1)}>
                  -
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="line"></div>
        <div className="second-container">
          <h3>Description :</h3>
          {!recipe.description && (
            <NoElementHere onClick={goToEditRecipe} element={"description"} />
          )}
          <p>{recipe.description}</p>
        </div>
      </div>
      <div
        ref={fixedBtnsRef}
        className="fixed-btns"
        id="fixed-recipe-card-btns"
      >
        <button className="delete-btn" onClick={deleteRecipe}>
          Delete
        </button>
        <button className="edit-btn" onClick={goToEditRecipe}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
