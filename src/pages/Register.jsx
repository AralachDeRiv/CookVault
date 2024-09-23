import React, { useRef, useEffect } from "react";
import { useAuth } from "../utils/authentification/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import animationFunctions from "../utils/animations/animations";

const Register = () => {
  const { user, registerUser, errorAuth, clearErrorAuth } = useAuth();
  const { horizontalShifting, emergence, wiggling } = animationFunctions;
  const registerForm = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPage = async () => {
      if (user) {
        navigate("/");
      }

      if (errorAuth) {
        await wiggling(registerForm.current);
        toast(errorAuth, {
          className: "toast-auth-message-error",
        });
        clearErrorAuth();
      }

      const fromPage = sessionStorage.getItem("from") || "unknown";
      if (fromPage == "login") {
        await horizontalShifting(registerForm.current, "from right");
        sessionStorage.removeItem("from");
      }
      if (fromPage !== "login" && !errorAuth) {
        await emergence(registerForm.current);
      }
    };
    loadPage();
  }, []);

  const gotToLogin = async () => {
    clearErrorAuth();
    sessionStorage.setItem("from", "register");
    await horizontalShifting(registerForm.current, "to right");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = registerForm.current.name.value;
    const email = registerForm.current.email.value;
    const password1 = registerForm.current.password1.value;
    const password2 = registerForm.current.password2.value;
    if (password1 !== password2) {
      toast("Passwords do not match !", {
        className: "toast-auth-message-error",
      });
      return;
    }

    await emergence(registerForm.current, false);

    const userInfo = { name, email, password: password1 };
    try {
      await registerUser(userInfo);
    } catch (err) {
      console.log("Register Error");
    }
  };

  return (
    <div className="main-content">
      <form
        ref={registerForm}
        onSubmit={handleSubmit}
        className="form-login-register"
      >
        <div className="input-container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" required />
        </div>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required />
        </div>
        <div className="input-container">
          <label htmlFor="password1">Password</label>
          <input type="password" name="password1" />
        </div>
        <div className="input-container">
          <label htmlFor="password2">Repeat password</label>
          <input type="password" name="password2" />
        </div>
        <p className="register-login-message">
          Already registered? <span onClick={gotToLogin}>Login</span>
        </p>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default Register;
