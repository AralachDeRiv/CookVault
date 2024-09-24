import React, { useEffect, useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { getPictureUrl } from "../appWrite/storage";
import chefCookImage from "../assets/chef_cook.png";
import animationFunctions from "../utils/animations/animations";

const SmallRecipeCard = forwardRef(({ recipe }, ref) => {
  const navigate = useNavigate();
  const [urlPicture, setUrlPicture] = useState(null);
  const { smallCardsAnimation, homePageAnimation } = animationFunctions;

  useEffect(() => {
    const getUrl = async () => {
      if (recipe.pictureID) {
        const url = await getPictureUrl(recipe.pictureID);
        setUrlPicture(url);
      } else {
        setUrlPicture(null);
      }
    };
    getUrl();
  }, [recipe]);

  const goToRecipeCard = async () => {
    await Promise.all([smallCardsAnimation(false), homePageAnimation(false)]);
    navigate("/recipe-card", {
      state: {
        recipe: recipe,
      },
    });
  };

  return (
    <div ref={ref} className="small-recipe-card" onClick={goToRecipeCard}>
      <div className="picture-container">
        <img
          src={urlPicture ? urlPicture : chefCookImage}
          alt="recipe picure"
        />
      </div>
      <h2>{recipe.title}</h2>
    </div>
  );
});

export default SmallRecipeCard;
