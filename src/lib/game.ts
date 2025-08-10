// Типы для игры и логика

export type CellType = "coin" | "bomb";
export type CellState = "hidden" | "revealed" | "flagged";

export interface Cell {
  type: CellType;
  state: CellState;
  position: { row: number; col: number };
}

export interface GameState {
  board: Cell[][];
  gameStatus: "playing" | "won" | "lost";
  coinsCollected: number;
  totalCoins: number;
}

export const BOARD_SIZE = 4;
const TOTAL_COINS = 15; // 16 клеток - 1 бомба = 15 монеток

// Создание пустой доски
const createEmptyBoard = (): Cell[][] => {
  const board: Cell[][] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const rowArray: Cell[] = [];
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      rowArray.push({
        type: "coin",
        state: "hidden",
        position: { row, col },
      });
    }
    board.push(rowArray);
  }

  return board;
};

// Размещение бомбы в случайной позиции
const placeBomb = (board: Cell[][]): Cell[][] => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  const randomRow = Math.floor(Math.random() * BOARD_SIZE);
  const randomCol = Math.floor(Math.random() * BOARD_SIZE);

  newBoard[randomRow]![randomCol]!.type = "bomb";

  return newBoard;
};

// Инициализация новой игры
export const initializeGame = (): GameState => {
  const emptyBoard = createEmptyBoard();
  const boardWithBomb = placeBomb(emptyBoard);

  return {
    board: boardWithBomb,
    gameStatus: "playing",
    coinsCollected: 0,
    totalCoins: TOTAL_COINS,
  };
};

// Проверка валидности позиции
const isValidPosition = (row: number, col: number): boolean =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

// Подсчет собранных монет
const countCollectedCoins = (board: Cell[][]): number =>
  board
    .flat()
    .filter((cell) => cell.type === "coin" && cell.state === "revealed").length;

// Открытие всех клеток
const revealAllCells = (board: Cell[][]): Cell[][] =>
  board.map((row) =>
    row.map((cell) => ({
      ...cell,
      state: "revealed" as CellState,
    })),
  );

// Открытие конкретной клетки
export const revealCell = (
  gameState: GameState,
  row: number,
  col: number,
): GameState => {
  if (!isValidPosition(row, col)) {
    throw new Error("Неверные координаты клетки");
  }

  if (gameState.gameStatus !== "playing") {
    return gameState;
  }

  const cell = gameState.board[row]?.[col];

  if (!cell) {
    throw new Error("Invalid board state");
  }

  if (cell.state === "revealed" || cell.state === "flagged") {
    return gameState;
  }

  const newBoard = gameState.board.map((boardRow, r) =>
    boardRow.map((boardCell, c) =>
      r === row && c === col
        ? { ...boardCell, state: "revealed" as CellState }
        : { ...boardCell },
    ),
  );

  let newGameStatus: "playing" | "won" | "lost" = "playing";
  let finalBoard = newBoard;

  if (cell.type === "bomb") {
    newGameStatus = "lost";
    finalBoard = revealAllCells(newBoard);
  } else {
    const coinsCollected = countCollectedCoins(newBoard);
    if (coinsCollected === TOTAL_COINS) {
      newGameStatus = "won";
      finalBoard = revealAllCells(newBoard);
    }
  }

  return {
    board: finalBoard,
    gameStatus: newGameStatus,
    coinsCollected: countCollectedCoins(finalBoard),
    totalCoins: TOTAL_COINS,
  };
};

// Установка/снятие флага
export const toggleFlag = (
  gameState: GameState,
  row: number,
  col: number,
): GameState => {
  if (!isValidPosition(row, col) || gameState.gameStatus !== "playing") {
    return gameState;
  }

  const cell = gameState.board[row]?.[col];

  if (!cell) {
    return gameState;
  }

  if (cell.state !== "revealed") {
    const newBoard = gameState.board.map((boardRow, r) =>
      boardRow.map((boardCell, c) => {
        if (r === row && c === col) {
          const newState: CellState =
            boardCell.state === "hidden" ? "flagged" : "hidden";
          return { ...boardCell, state: newState };
        }
        return { ...boardCell };
      }),
    );

    return {
      ...gameState,
      board: newBoard,
    };
  }

  return gameState;
};

// Получение информации о конкретной клетке
export const getCellInfo = (
  gameState: GameState,
  row: number,
  col: number,
): Cell | null => {
  if (!isValidPosition(row, col)) {
    return null;
  }
  const cell = gameState.board[row]?.[col];
  if (!cell) return null;
  return { ...cell };
};

// Получение позиции бомбы (для отладки)
export const getBombPosition = (
  gameState: GameState,
): { row: number; col: number } | null => {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const rowArray = gameState.board[row];
    if (!rowArray) continue;
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = rowArray[col];
      if (cell && cell.type === "bomb") {
        return { row, col };
      }
    }
  }
  return null;
};

// Проверка возможности хода
export const canMakeMove = (gameState: GameState): boolean =>
  gameState.gameStatus === "playing";

// Получение статистики
export const getGameStats = (
  gameState: GameState,
): {
  coinsCollected: number;
  totalCoins: number;
  remainingCoins: number;
  progress: number;
} => {
  const remainingCoins = gameState.totalCoins - gameState.coinsCollected;
  const progress = (gameState.coinsCollected / gameState.totalCoins) * 100;

  return {
    coinsCollected: gameState.coinsCollected,
    totalCoins: gameState.totalCoins,
    remainingCoins,
    progress: Math.round(progress),
  };
};

export const isGameWon = (gameState: GameState): boolean =>
  gameState.gameStatus === "won";
export const isGameLost = (gameState: GameState): boolean =>
  gameState.gameStatus === "lost";
export const isGameActive = (gameState: GameState): boolean =>
  gameState.gameStatus === "playing";
