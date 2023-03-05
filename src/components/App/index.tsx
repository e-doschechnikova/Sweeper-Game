import React, { useState, useEffect } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateSells, openMultipleCells } from "../../utils/index";
import Button from "../Button/Button";
import { Cell, CellState, CellValue, Face } from "../../types";
import { MAX_COLS, MAX_ROWS } from "../../constants";
import { BOMBS } from "./../../constants/index";

function App() {
  const [cells, setCells] = useState<Cell[][]>(generateSells()); //console.log(cells);
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombsCounter, setBombsCounter] = useState<number>(BOMBS);
  const [lost, setLost] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const handleMouseDown = (e: MouseEvent) => {
    if (lost || won) return;

    const target = e.target as HTMLElement;

    if (
      target.className.includes("Button") &&
      !target.className.includes("visible") &&
      e.button === 0
    ) {
      setFace(Face.scared);
    }
  };

  const handleMouseUp = () => {
    if (lost || won) return;
    setFace(Face.smile);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [lost, won]);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  useEffect(() => {
    if (lost) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [lost]);

  useEffect(() => {
    if (won) {
      setLive(false);
      setFace(Face.won);
    }
  }, [won]);

  const handleCellClick =
    (rowParams: number, columnParams: number) => (): void => {
      if (lost || won) return;

      let newCells = cells.slice();

      // начало игры
      if (!live) {
        let bomb = newCells[rowParams][columnParams].value === CellValue.bomb;
        while (bomb) {
          newCells = generateSells();
          console.log("new current cell", newCells[rowParams][columnParams]);

          if (newCells[rowParams][columnParams].value !== CellValue.bomb) {
            bomb = false;
            break;
          }
        }
        setLive(true);
      }

      const currentCell = newCells[rowParams][columnParams];

      if ([CellState.flag, CellState.visible].includes(currentCell.state)) {
        return;
      }
      if (currentCell.value === CellValue.bomb) {
        setLost(true);
        newCells = showAllBombs();
        newCells[rowParams][columnParams].red = true;
        setCells(newCells);
        return;
      } else if (currentCell.value === CellValue.none) {
        newCells = openMultipleCells(newCells, rowParams, columnParams);
      } else {
        newCells[rowParams][columnParams].state = CellState.visible;
      }

      // выигрыш
      let safeOpenCellsExists = false;
      for (let row = 0; row < MAX_ROWS; row++) {
        for (let column = 0; column < MAX_COLS; column++) {
          const currentCell = newCells[row][column];
          if (
            currentCell.value !== CellValue.bomb &&
            currentCell.state === CellState.open
          ) {
            safeOpenCellsExists = true;
            break;
          }
        }
      }
      if (!safeOpenCellsExists) {
        newCells = newCells.map((row) =>
          row.map((cell) => {
            if (cell.value === CellValue.bomb) {
              return {
                ...cell,
                state: CellState.flag,
              };
            }
            return cell;
          })
        );
        setWon(true);
      }
      setCells(newCells);
    };

  const handleCellContext =
    (rowParams: number, columnParams: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      if (!live) {
        return;
      }

      const currentCells = cells.slice();
      const currentCell = cells[rowParams][columnParams];

      if (currentCell.state === CellState.visible) {
        return;
      } else if (currentCell.state === CellState.open) {
        if (bombsCounter > 0) {
          currentCells[rowParams][columnParams].state = CellState.flag;
          setCells(currentCells);
          setBombsCounter(bombsCounter - 1);
        }
      } else if (currentCell.state === CellState.flag) {
        currentCells[rowParams][columnParams].state = CellState.question;
        setCells(currentCells);
      } else if (currentCell.state === CellState.question) {
        currentCells[rowParams][columnParams].state = CellState.open;
        setCells(currentCells);
        setBombsCounter(bombsCounter + 1);
      }
    };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateSells());
    setLost(false);
    setWon(false);
    setBombsCounter(BOMBS);
    setFace(Face.smile);
  };

  const rerenderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, columnIndex) => (
        <Button
          key={`${rowIndex}-${columnIndex}`}
          row={rowIndex}
          column={columnIndex}
          state={cell.state}
          value={cell.value}
          onClick={handleCellClick}
          onContext={handleCellContext}
          red={cell.red}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }
        return cell;
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombsCounter} />
        <div className={`Face ${face}`} onClick={handleFaceClick}></div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{rerenderCells()}</div>
    </div>
  );
}

export default App;
