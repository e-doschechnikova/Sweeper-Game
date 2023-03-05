import React from "react";
import "./NumberDisplay.scss";

type NumberDisplayPropsType = {
  value: number;
};

const NumberDisplay: React.FC<NumberDisplayPropsType> = ({ value }) => {
  const digits = Math.abs(value).toString().padStart(3, "0").split("");

  return (
    <div className="NumberDisplay">
      {digits.map((digit, id) => (
        <div className={`digit n-${digit}`} key={`n-${digit}${Math.random() * id}`}></div>
      ))}
    </div>
  );
};

export default NumberDisplay;
