const valueInitialRightPosition = 3000;
const valueInitialLeftPosition = -valueInitialRightPosition;
const valueExcessRightPosition = 30;
const valueExcessLeftPosition = -valueExcessRightPosition;

// Le longdelay est mis en fonction de la transition-duration par defaut
const longDelay = 500;
const middleDelay = 350;
const smallDelay = 200;
const verySmallDelay = 100;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setOpacity = (element, transparent = true) => {
  const opacity = transparent ? "0" : "1";
  element.style.opacity = opacity;
};

const emergence = async (element, showUp = true) => {
  const transparent = showUp;
  setOpacity(element, transparent);
  await delay(smallDelay);
  setOpacity(element, !transparent);
  await delay(longDelay);
};

const setHorizontalPositions = (element, location) => {
  let position;
  switch (location) {
    case "right":
      position = valueInitialRightPosition;
      break;
    case "left":
      position = valueInitialLeftPosition;
      break;
    case "initial":
      position = 0;
      break;
  }
  element.style.transform = `translateX(${position}px)`;
};

const setHorizontalExcess = (element, location) => {
  let position;
  switch (location) {
    case "right":
      position = valueExcessRightPosition;
      break;
    case "left":
      position = valueExcessLeftPosition;
      break;
    case "initial":
      position = 0;
      break;
  }

  element.style.transform = `translateX(${position}px)`;
};

const horizontalShifting = async (element, direction) => {
  document.body.style.overflow = "hidden";
  let position;
  let exceedPosition;
  switch (direction) {
    case "from right":
    case "from left":
      position = direction.split(" ").at(-1);
      exceedPosition = position == "left" ? "right" : "left";

      setOpacity(element, true);
      setHorizontalPositions(element, position);
      await delay(smallDelay);
      setOpacity(element, false);
      setHorizontalExcess(element, exceedPosition);
      await delay(longDelay);
      element.style.transitionDuration = `${smallDelay}ms`;
      setHorizontalPositions(element, "initial");
      await delay(smallDelay);
      element.style.transitionDuration = `${longDelay}ms`;
      break;

    case "to left":
    case "to right":
      position = direction.split(" ").at(-1);
      exceedPosition = position == "left" ? "right" : "left";

      element.style.transitionDuration = `${smallDelay}ms`;
      setHorizontalExcess(element, exceedPosition);
      await delay(smallDelay);
      element.style.transitionDuration = `${longDelay}ms`;
      setHorizontalPositions(element, position);
      await delay(longDelay);
      setOpacity(element, true);
      break;
  }

  document.body.style.overflowY = "visible";
};

const wiggling = async (element) => {
  element.style.transitionDuration = `${verySmallDelay}ms`;
  setOpacity(element, false);

  setHorizontalExcess(element, "left");
  await delay(verySmallDelay);
  setHorizontalExcess(element, "right");
  await delay(verySmallDelay);
  setHorizontalExcess(element, "left");
  await delay(verySmallDelay);
  setHorizontalPositions(element, "initial");
  await delay(middleDelay);

  element.style.transitionDuration = `${longDelay}ms`;
};

const smallCardsAnimation = async (showUp = false) => {
  const smallCards = document.querySelectorAll(".small-recipe-card");
  const promises = Array.from(smallCards).map((el, index) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        await emergence(el, showUp);
        resolve();
      }, 70 * index);
    });
  });
  await Promise.all(promises);
};

// problème de rythme
const homePageAnimation = async (showUp = false) => {
  const mainContainer = document.getElementById("main-container");
  await emergence(mainContainer, showUp);
};

const recipeFormAnimation = async (direction = "to right") => {
  const recipeForm = document.getElementById("recipe-form");
  await horizontalShifting(recipeForm, direction);
};

const recipeCardAnimation = async (showUp = false) => {
  const recipeCard = document.getElementById("recipe-card");
  const fixedBtn = document.getElementById("fixed-recipe-card-btns");
  await emergence(fixedBtn, false);
  await emergence(recipeCard, false);
};

const animationFunctions = {
  delay,
  setHorizontalPositions,
  horizontalShifting,
  emergence,
  wiggling,

  smallCardsAnimation,
  recipeFormAnimation,
  recipeCardAnimation,
  homePageAnimation,
};

export default animationFunctions;
