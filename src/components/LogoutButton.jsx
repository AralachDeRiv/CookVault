import React from "react";
import { useAuth } from "../utils/authentification/AuthContext";

const LogoutButton = () => {
  const { logoutUser } = useAuth();

  return <button onClick={logoutUser}>Log out</button>;
};

export default LogoutButton;
