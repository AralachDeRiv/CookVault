import React, { createContext, useEffect, useRef, useState } from "react";
import db from "../appWrite/databases";
import IngredientsInputs from "../components/IngredientsInputs";
import { uploadPicture, deletePicture } from "../appWrite/storage";
import { useAuth } from "../utils/authentification/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import animationFunctions from "../utils/animations/animations";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export const formContext = createContext();

const RecipeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const recipeFormRef = useRef(null);
  const [ingredients, setIngredients] = useState([]);
  const [file, setFile] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { horizontalShifting } = animationFunctions;

  useEffect(() => {
    const loadRecipeForm = async () => {
      if (id) {
        setLoading(true);
        const recipeById = await db.recipes.get(id);
        setRecipeToEdit(recipeById);
        setLoading(false);
      }

      // Pour une certaine raison, les transitions ne sont pas tj fluides lorsque j'arrive depuis une autre page
      // Pas une solution idéale mais fonctionne
      setTimeout(async () => {
        await horizontalShifting(recipeFormRef.current, "from right");
      }, 400);
    };

    loadRecipeForm();
  }, []);

  useEffect(() => {
    if (recipeToEdit) {
      setIngredients(JSON.parse(recipeToEdit.ingredients));
      setNumberOfPeople(recipeToEdit.people);
    }
  }, [recipeToEdit]);

  const increaseNumberOfPeople = () => {
    setNumberOfPeople((prev) => prev + 1);
  };

  const decreaseNumberOfPeople = () => {
    if (numberOfPeople > 1) {
      setNumberOfPeople((prev) => prev - 1);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        if (recipeToEdit && recipeToEdit.pictureID) {
          await deletePicture(recipeToEdit.pictureID);
        }
        const response = await uploadPicture(file);
        console.log("File uploaded successfully:", response);
        return response;
      } catch (err) {
        console.error("File upload failed:", err);
        toast(err.message, {
          className: "toast-message",
        });

        return null;
      }
    }
    return null;
  };

  const addRecipe = async (finalObject) => {
    try {
      const response = await db.recipes.create(finalObject);
      sessionStorage.setItem("message", "Recipe added successfully!");
      return response;
    } catch (error) {
      console.error(error.message);
      toast(err.message, {
        className: "toast-message",
      });
    }
  };

  const editRecipe = async (finalObject) => {
    try {
      const response = await db.recipes.update(recipeToEdit.$id, finalObject);
      setRecipeToEdit(null);
      sessionStorage.setItem("message", "Recipe updated successfully!");
      return response;
    } catch (err) {
      console.error(err);
      toast(err.message, {
        className: "toast-message",
      });
    }
  };

  const movingForm = async () => {
    await horizontalShifting(recipeFormRef.current, "to right");
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();

    try {
      await movingForm();
      setLoading(true);
      const title = recipeFormRef.current.title.value;
      const description = recipeFormRef.current.description.value;
      const people = recipeFormRef.current.people.value;

      const uploadResponse = await handleUpload();

      const finalObject = {
        title,
        pictureID: uploadResponse
          ? uploadResponse.$id
          : recipeToEdit?.pictureID || "",
        description,
        ingredients: JSON.stringify(ingredients),
        userID: user.$id,
        people: Number(people),
      };

      if (recipeToEdit) {
        await editRecipe(finalObject);
      } else {
        await addRecipe(finalObject);
      }

      setIngredients([]);
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast(err.message, {
        className: "toast-message",
      });
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  const value = {
    ingredients,
    setIngredients,
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="main-content">
      <formContext.Provider value={value}>
        <form
          ref={recipeFormRef}
          className="recipe-form"
          id="recipe-form"
          onSubmit={handleRecipeSubmit}
        >
          <div className="first-container">
            <div className="text-area-container">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                defaultValue={recipeToEdit ? recipeToEdit.description : ""}
              />
            </div>
          </div>
          <div className="second-container">
            <div className="input-container">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={recipeToEdit ? recipeToEdit.title : ""}
                required
              />
            </div>

            <div className="file-upload">
              <label htmlFor="file-input" className="custom-file-upload">
                Choose a picture
              </label>
              <input id="file-input" type="file" onChange={handleFileChange} />
              <span id="file-name">
                {file ? "File selected" : "No file selected"}
              </span>
            </div>

            <IngredientsInputs />
            <div className="input-people-container">
              <label htmlFor="people">People</label>

              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                min="1"
                step="1"
                name="people"
                placeholder="people"
              />
              <p className="plus-minus">
                <span onClick={decreaseNumberOfPeople}>-</span>/
                <span onClick={increaseNumberOfPeople}>+</span>
              </p>
            </div>
          </div>

          <button className="submit-recipe-btn" type="submit">
            Submit
          </button>
        </form>
      </formContext.Provider>
    </div>
  );
};

export default RecipeForm;
