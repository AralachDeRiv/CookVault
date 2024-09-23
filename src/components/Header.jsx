import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import LogoContainer from "./LogoContainer";
import { useAuth } from "../utils/authentification/AuthContext";
import animationFunctions from "../utils/animations/animations";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let { user, logoutUser } = useAuth();
  user = user ? user : false;
  const navbarRef = useRef(null);
  const {
    emergence,
    smallCardsAnimation,
    recipeFormAnimation,
    recipeCardAnimation,
    homePageAnimation,
  } = animationFunctions;

  const handleAnimation = async () => {
    const path = location.pathname;
    if (path == "/") {
      await Promise.all([smallCardsAnimation(false), homePageAnimation(false)]);
    } else if (path.includes("/recipe-form")) {
      await recipeFormAnimation();
    } else if (path == "/recipe-card") {
      await recipeCardAnimation();
    }
  };

  const doSomething = () => {
    toast("It is a beautiful logo, isn't it?", {
      className: "toast-message",
    });
  };

  useEffect(() => {
    if (user) {
      emergence(navbarRef.current, true);
    }
  }, [user]);

  const goToPage = async (page) => {
    const routeBase = location.pathname.split("/").at(1);
    const pageBase = page.substring(1);

    if (page !== location.pathname && routeBase !== pageBase) {
      await handleAnimation();
      navigate(page);
    }
  };

  const setClassActive = (page) => {
    return location.pathname === page ? "active" : "";
  };

  const handleLogout = async () => {
    await handleAnimation();
    await emergence(navbarRef.current, false);
    await logoutUser();
  };

  return (
    <header>
      <LogoContainer onClick={doSomething} />
      {user && (
        <ul ref={navbarRef}>
          <li className={setClassActive("/")} onClick={() => goToPage("/")}>
            Home
          </li>
          <li
            className={setClassActive("/recipe-form")}
            onClick={() => goToPage("/recipe-form")}
          >
            Add Recipe
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      )}
    </header>
  );
};

export default Header;
