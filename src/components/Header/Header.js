import React from "react";
import "./Header.scss";

const Header = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const body = document.body;
    const toggle = document.querySelector(".toggle-inner");
    if (darkMode === true) {
      body.classList.add("dark-mode");
      toggle.classList.add("toggle-active");
    } else {
      body.classList.remove("dark-mode");
      toggle.classList.remove("toggle-active");
    }
  }, [darkMode]);

  return (
    <header>
      <div
        id="toggle"
        onClick={() =>
          darkMode === false ? setDarkMode(true) : setDarkMode(false)
        }
      >
        <div className="toggle-inner" />
      </div>
      <div className="header">
        <h1>Memory Card Game</h1>
      </div>
    </header>
  );
};

export default Header;
