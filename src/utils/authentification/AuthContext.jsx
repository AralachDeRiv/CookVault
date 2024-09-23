import React, { createContext, useEffect, useState, useContext } from "react";
import { account } from "../../appWrite/config";
import { ID } from "appwrite";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const [errorAuth, setErrorAuth] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    setLoading(true);

    try {
      const accouDetails = await account.get();
      setUser(accouDetails);
    } catch (err) {
      console.error("Utilisateur non authentifié");
      setUser(null);
    }

    setLoading(false);
  };

  const handleAppwriteExceptions = (err) => {
    if (err.message.startsWith("Invalid credentials")) {
      return err.message.split(".").at(1);
    } else {
      return err.message.split(":").at(-1);
    }
  };

  const clearErrorAuth = () => {
    setErrorAuth(null);
  };

  const setErrorAuthMessage = (message) => {
    setErrorAuth(message);
  };

  const handleErrorAuthMessage = (err) => {
    const errorMessage = handleAppwriteExceptions(err);
    setErrorAuthMessage(errorMessage);
  };

  const loginUser = async (userInfo) => {
    setLoading(true);
    try {
      let response = await account.createEmailPasswordSession(
        userInfo.email,
        userInfo.password
      );
      let accountDetails = await account.get();
      setUser(accountDetails);
      clearErrorAuth();
    } catch (err) {
      console.error(err);
      handleErrorAuthMessage(err);
    }
    setLoading(false);
  };

  const logoutUser = () => {
    account.deleteSession("current");
    setUser(null);
    clearErrorAuth();
  };

  const registerUser = async (userInfo) => {
    setLoading(true);

    try {
      let response = await account.create(
        ID.unique(),
        userInfo.email,
        userInfo.password,
        userInfo.name
      );
      await account.createEmailPasswordSession(
        userInfo.email,
        userInfo.password
      );

      let accountDetails = await account.get();
      setUser(accountDetails);
      clearErrorAuth();
    } catch (err) {
      console.error(err);
      handleErrorAuthMessage(err);
    }

    setLoading(false);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
    errorAuth,
    clearErrorAuth,
  };

  return (
    <AuthContext.Provider value={contextData}>
      <Header />
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
