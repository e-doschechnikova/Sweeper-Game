import { BOMBS, MAX_COLS, MAX_ROWS } from "../constants";
import { Cell, CellState, CellValue } from "../types";

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  columnParam: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && columnParam > 0
      ? cells[rowParam - 1][columnParam - 1]
      : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][columnParam] : null;
  const topRightCell =
    rowParam > 0 && columnParam < MAX_COLS - 1
      ? cells[rowParam - 1][columnParam + 1]
      : null;
  const leftCell = columnParam > 0 ? cells[rowParam][columnParam - 1] : null;
  const rightCell =
    columnParam < MAX_COLS - 1 ? cells[rowParam][columnParam + 1] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS - 1 && columnParam > 0
      ? cells[rowParam + 1][columnParam - 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][columnParam] : null;
  const bottomRightCell =
    rowParam < MAX_ROWS - 1 && columnParam < MAX_COLS - 1
      ? cells[rowParam + 1][columnParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

// генерация ячеек
export const generateSells = (): Cell[][] => {
  let cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let column = 0; column < MAX_COLS; column++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
      });
    }
  }

  // рандомные бомбы (40)
  let bombsPlaced = 0;

  while (bombsPlaced < BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomColumn = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomColumn];

    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          if (randomRow === rowIndex && randomColumn === columnIndex) {
            return {
              ...cell, //state: cell.state
              value: CellValue.bomb,
            };
          }

          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  // вычисление числа для каждой ячейки
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let columnIndex = 0; columnIndex < MAX_COLS; columnIndex++) {
      const currentCell = cells[rowIndex][columnIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }

      let numberOfBombs = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
      } = grabAllAdjacentCells(cells, rowIndex, columnIndex);

      if (topLeftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topRightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (leftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (rightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomLeftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomRightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }

      if (numberOfBombs > 0) {
        cells[rowIndex][columnIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  columnParam: number
): Cell[][] => {
  const currentCell = cells[rowParam][columnParam];
  if (
    currentCell.state === CellState.visible ||
    currentCell.state === CellState.flag
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][columnParam].state = CellState.visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  } = grabAllAdjacentCells(cells, rowParam, columnParam);

  if (
    topLeftCell?.state === CellState.open &&
    topLeftCell.value !== CellValue.bomb
  ) {
    if (topLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, columnParam - 1);
    } else {
      newCells[rowParam - 1][columnParam - 1].state = CellState.visible;
    }
  }

  if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
    if (topCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, columnParam - 1);
    } else {
      newCells[rowParam - 1][columnParam - 1].state = CellState.visible;
    }
  }

  if (
    topRightCell?.state === CellState.open &&
    topRightCell.value !== CellValue.bomb
  ) {
    if (topRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, columnParam + 1);
    } else {
      newCells[rowParam - 1][columnParam + 1].state = CellState.visible;
    }
  }

  if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
    if (leftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, columnParam - 1);
    } else {
      newCells[rowParam][columnParam - 1].state = CellState.visible;
    }
  }

  if (
    rightCell?.state === CellState.open &&
    rightCell.value !== CellValue.bomb
  ) {
    if (rightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, columnParam + 1);
    } else {
      newCells[rowParam][columnParam + 1].state = CellState.visible;
    }
  }

  if (
    bottomLeftCell?.state === CellState.open &&
    bottomLeftCell.value !== CellValue.bomb
  ) {
    if (bottomLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, columnParam - 1);
    } else {
      newCells[rowParam + 1][columnParam - 1].state = CellState.visible;
    }
  }

  if (
    bottomCell?.state === CellState.open &&
    bottomCell.value !== CellValue.bomb
  ) {
    if (bottomCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, columnParam);
    } else {
      newCells[rowParam + 1][columnParam].state = CellState.visible;
    }
  }

  if (
    bottomRightCell?.state === CellState.open &&
    bottomRightCell.value !== CellValue.bomb
  ) {
    if (bottomRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, columnParam + 1);
    } else {
      newCells[rowParam + 1][columnParam + 1].state = CellState.visible;
    }
  }

  return newCells;
};
