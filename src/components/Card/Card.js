import React from "react";

const Card = (props) => {
  const { imgSource, imgDesc, className, onClick } = props;

  return (
    <div className={`card ${className}`} onClick={onClick}>
      <img className={`img`} src={imgSource} alt={imgDesc} />
      <style className="hover"></style>
    </div>
  );
};

export default Card;
