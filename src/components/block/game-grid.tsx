import { useCallback, useEffect, useMemo, useState } from "react";
import CustomGameButton from "~/components/ui/custom-game-button";
import {
  initializeGame,
  revealCell,
  toggleFlag,
  type Cell,
  type GameState,
} from "~/lib/game";

interface GameGridProps {
  gameId: number;
  onGameEnd?: (status: "won" | "lost") => void;
}

const GameGrid = ({ gameId, onGameEnd }: GameGridProps) => {
  const [game, setGame] = useState<GameState>(() => initializeGame());

  const cells = useMemo<Cell[]>(() => game.board.flat(), [game.board]);

  const handleReveal = useCallback((row: number, col: number) => {
    setGame((prev: GameState) => revealCell(prev, row, col));
  }, []);

  const handleToggleFlag = useCallback((row: number, col: number) => {
    setGame((prev: GameState) => toggleFlag(prev, row, col));
  }, []);

  useEffect(() => {
    setGame(initializeGame());
  }, [gameId]);

  useEffect(() => {
    if (game.gameStatus === "won" || game.gameStatus === "lost") {
      onGameEnd?.(game.gameStatus);
    }
  }, [game.gameStatus, onGameEnd]);

  return (
    <div className={`grid grid-cols-4 gap-4`}>
      {cells.map((cell) => (
        <CustomGameButton
          key={`${cell.position.row}-${cell.position.col}`}
          type={cell.type}
          state={cell.state}
          onReveal={() => handleReveal(cell.position.row, cell.position.col)}
          onToggleFlag={() =>
            handleToggleFlag(cell.position.row, cell.position.col)
          }
        />
      ))}
    </div>
  );
};

export default GameGrid;
