import React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

type ButtonPropsType = {
  row: number;
  column: number;

  state: CellState;
  value: CellValue;

  onClick(rowParams: number, columnParams: number): (...args: any[]) => void;
  onContext(rowParams: number, columnParams: number): (...args: any[]) => void;

  red?: boolean;
};

const Button: React.FC<ButtonPropsType> = ({
  row,
  column,
  state,
  value,
  onClick,
  onContext,
  red,
}) => {
  return (
    <div
      className={`Button ${
        state === CellState.visible && "visible"
      } value-${value} ${red && "red"} ${state}`}
      onClick={onClick(row, column)}
      onContextMenu={onContext(row, column)}
    ></div>
  );
};

export default Button;
