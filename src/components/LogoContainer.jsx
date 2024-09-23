import React from "react";
import saucepan from "../assets/saucepan.png";

const LogoContainer = ({ onClick }) => {
  return (
    <div className="logo-container" onClick={onClick}>
      <img src={saucepan} alt="logo" />
    </div>
  );
};

export default LogoContainer;
