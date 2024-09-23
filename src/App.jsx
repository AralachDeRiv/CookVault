import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeForm from "./pages/RecipeForm";
import RecipeCard from "./pages/RecipeCard";
import PrivateRoute from "./utils/authentification/PrivateRoutes";
import { AuthProvider } from "./utils/authentification/AuthContext";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer
            hideProgressBar={true}
            closeButton={false}
            autoClose={1750}
          />
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Home />}></Route>
              <Route path="/recipe-form" element={<RecipeForm />}></Route>
              <Route path="/recipe-form/:id" element={<RecipeForm />}></Route>
              <Route path="/recipe-card" element={<RecipeCard />}></Route>
            </Route>
            <Route path="*" element={<Navigate to={"/"} />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
