import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../utils/authentification/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import animationFunctions from "../utils/animations/animations";

const Login = () => {
  const { user, loginUser, errorAuth, clearErrorAuth } = useAuth();
  const { horizontalShifting, emergence, wiggling } = animationFunctions;
  const loginForm = useRef(null);
  const navigate = useNavigate();

  // !! attention le comportement des toasts est modifié si l'app est en strict mode
  useEffect(() => {
    const loadPage = async () => {
      if (user) {
        navigate("/");
      }
      if (errorAuth) {
        console.log(errorAuth);
        await wiggling(loginForm.current);
        toast(errorAuth, {
          className: "toast-auth-message-error",
        });
        clearErrorAuth();
      }
      const fromPage = sessionStorage.getItem("from") || "unknown";
      if (fromPage == "register") {
        await horizontalShifting(loginForm.current, "from left");
        sessionStorage.removeItem("from");
      }
      if (fromPage !== "register" && !errorAuth) {
        await emergence(loginForm.current);
      }
    };
    loadPage();
  }, []);

  const gotToRegister = async () => {
    clearErrorAuth();
    sessionStorage.setItem("from", "login");
    await horizontalShifting(loginForm.current, "to left");
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergence(loginForm.current, false);
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;
    const userInfo = { email, password };

    try {
      await loginUser(userInfo);
    } catch (error) {
      console.log("loginError");
    }
  };

  return (
    <div className="main-content">
      <form
        ref={loginForm}
        onSubmit={handleSubmit}
        className="form-login form-login-register"
      >
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
        </div>
        <p className="register-login-message">
          Not registered yet? <span onClick={gotToRegister}>Register</span>
        </p>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Login;
