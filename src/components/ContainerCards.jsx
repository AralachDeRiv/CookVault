import React, { useEffect, useRef, useState } from "react";
import db from "../appWrite/databases";
import { useAuth } from "../utils/authentification/AuthContext";
import SmallRecipeCard from "./SmallRecipeCard";
import animationFunctions from "../utils/animations/animations";
import { toast } from "react-toastify";
import NoElementHere from "./NoElementHere";
import { useNavigate } from "react-router-dom";

const ContainerCards = () => {
  const [recipes, setRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const cardRefs = useRef([]);
  const searchFormRef = useRef(null);
  const paginationRef = useRef(null);
  const searchBarRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { emergence, smallCardsAnimation, homePageAnimation } =
    animationFunctions;

  const getNumberOfPages = (recipesLength) => {
    return Math.ceil(recipesLength / 10);
  };

  const updateDisplayedRecipes = (page) => {
    const startIndex = (page - 1) * 10;
    const endIndex = Math.min(startIndex + 10, recipes.length);
    setDisplayedRecipes(recipes.slice(startIndex, endIndex));
  };

  useEffect(() => {
    if (sessionStorage.getItem("message")) {
      toast(sessionStorage.getItem("message"), {
        className: "toast-message",
      });
      sessionStorage.removeItem("message");
    }
  }, []);

  useEffect(() => {
    const loadrecipes = async () => {
      const response = await db.recipes.list();
      const userRecipes = response.documents.filter(
        (r) => r.userID == user.$id
      );
      setNumberOfPages(getNumberOfPages(userRecipes.length));
      setRecipes(userRecipes);
      setDisplayedRecipes(
        userRecipes.slice(0, Math.min(10, userRecipes.length))
      );

      await homePageAnimation(true);
    };
    loadrecipes();
  }, [user.$id]);

  useEffect(() => {
    setNumberOfPages(getNumberOfPages(recipes.length));
    updateDisplayedRecipes(currentPage);
  }, [recipes, currentPage]);

  const loadRecipesAnimation = () => {
    cardRefs.current = cardRefs.current.slice(0, displayedRecipes.length);
    cardRefs.current.forEach((el, idx) => {
      if (el) {
        setTimeout(() => {
          emergence(el, true);
        }, 82 * idx);
      }
    });
  };

  useEffect(() => {
    const loadNewPage = async () => {
      loadRecipesAnimation();
    };
    loadNewPage();
  }, [displayedRecipes]);

  const handlePageChange = async (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= numberOfPages) {
      await smallCardsAnimation();
      setCurrentPage(pageNumber);
      updateDisplayedRecipes(pageNumber);
    }
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    const input = searchFormRef.current.searchInput.value.toLowerCase();
    const matchingRecipes = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(input)
    );
    setIsSearching(true);
    setDisplayedRecipes(matchingRecipes);
    searchFormRef.current.reset();

    if (paginationRef.current !== null) {
      paginationRef.current.style.display = "none";
    }
  };

  const handleComeBackFromSearching = () => {
    setIsSearching(false);
    setCurrentPage(1);
    updateDisplayedRecipes(1);
  };

  const goToAddRecipe = async () => {
    await Promise.all([smallCardsAnimation(), homePageAnimation()]);
    navigate("/recipe-form");
  };

  return (
    <div className="main-container" id="main-container">
      <div ref={searchBarRef} className="search-bar">
        <form ref={searchFormRef} onSubmit={handleSearchFormSubmit}>
          <div className="input-container">
            <label htmlFor="searchInput">search</label>
            <input type="text" name="searchInput" />
          </div>
        </form>
        <button className="get-btn" onClick={handleSearchFormSubmit}>
          Get
        </button>
      </div>
      {isSearching && (
        <button onClick={handleComeBackFromSearching} className="come-back-btn">
          Come Back
        </button>
      )}
      {!isSearching && numberOfPages > 1 && (
        <div ref={paginationRef} className="pagination">
          <span
            className={`arrow minus ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {"<"}
          </span>
          {[...Array(numberOfPages)].map((_, index) => (
            <span
              key={index}
              className={`page-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </span>
          ))}
          <span
            className={`arrow plus ${
              currentPage === numberOfPages ? "disabled" : ""
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {">"}
          </span>
        </div>
      )}
      {recipes.length > 0 ? (
        <div className="cards-container">
          {displayedRecipes.map((recipe, index) => (
            <SmallRecipeCard
              key={index}
              recipe={recipe}
              ref={(el) => (cardRefs.current[index] = el)}
            />
          ))}
        </div>
      ) : (
        <NoElementHere element={"recipe"} onClick={goToAddRecipe} />
      )}
    </div>
  );
};

export default ContainerCards;
