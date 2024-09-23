import React from "react";

const NoElementHere = ({ onClick, element }) => {
  return (
    <div className="no-element-container">
      <p>¯\_(ʘ‿ʘ)_/¯</p>
      <p>
        Add {element} <span onClick={onClick}>here</span>
      </p>
    </div>
  );
};

export default NoElementHere;
