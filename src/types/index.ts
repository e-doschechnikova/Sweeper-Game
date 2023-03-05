export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  bomb = "bomb",
}

export enum CellState {
  open = 'open',
  visible = 'visible',
  flag = 'flag',
  question = 'question',
}

export type Cell = { value: CellValue; state: CellState; red?: boolean };

export enum Face {
  smile = "smile",
  scared = "scared",
  lost = "lost",
  won = "won",
}
