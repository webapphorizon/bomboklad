"use client";

import { useCallback, useMemo, useState } from "react";
import GameGrid from "~/components/block/game-grid";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function HomePage() {
  const [balance, setBalance] = useState<number>(100);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [inRound, setInRound] = useState<boolean>(false);
  const [gameId, setGameId] = useState<number>(0);

  const canBet = useMemo(
    () => !inRound && betAmount > 0 && betAmount <= balance,
    [inRound, betAmount, balance],
  );

  const handleBet = useCallback(() => {
    if (!canBet) return;
    setBalance((b) => b - betAmount);
    setInRound(true);
    setGameId((id) => id + 1);
  }, [betAmount, canBet]);

  const handleGameEnd = useCallback(
    (status: "won" | "lost") => {
      if (status === "won") {
        setBalance((b) => b + betAmount * 2);
      }
      setInRound(false);
    },
    [betAmount],
  );

  return (
    <main
      className={`flex max-h-screen flex-col items-center justify-center gap-4 p-4 text-white`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-medium">Balance: {balance}$</h1>
        <Button className="bg-transparent border border-primary text-primary">add balance</Button>
      </div>
      <GameGrid gameId={gameId} onGameEnd={handleGameEnd} />

      <div className="w-full">
        <p>bet amount</p>
        <Input
          type="number"
          value={betAmount === 0 ? "" : betAmount}
          placeholder="0"
          min={1}
          max={balance}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isNaN(next)) return;
            setBetAmount(next);
          }}
          disabled={inRound}
        />
      </div>
      <Button
        className="h-16 w-full bg-green-600 text-3xl font-bold uppercase"
        onClick={handleBet}
        disabled={!canBet}
      >
        {inRound ? "in game" : "bet"}
      </Button>
    </main>
  );
}
