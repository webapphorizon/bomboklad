"use client";

import { useCallback, useMemo, useState } from "react";
import GameGrid from "~/components/block/game-grid";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { connectMetaMask, shortenAddress } from "~/lib/wallet";

export default function HomePage() {
  const [balance, setBalance] = useState<number>(100);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [inRound, setInRound] = useState<boolean>(false);
  const [gameId, setGameId] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

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

  const handleConnectWallet = useCallback(async () => {
    try {
      setConnecting(true);
      const { address } = await connectMetaMask();
      setWalletAddress(address);
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error
          ? err.message
          : `Failed to connect wallet. Ensure MetaMask is installed.`,
      );
    } finally {
      setConnecting(false);
    }
  }, []);

  return (
    <main
      className={`flex max-h-screen flex-col items-center justify-center gap-4 p-4 text-white`}
    >
      <div className="flex w-full justify-between">
        <h1 className="text-3xl font-medium">Balance: {balance}$</h1>
        <Button
          className="border-primary text-primary border bg-transparent"
          onClick={handleConnectWallet}
          disabled={connecting}
          title={walletAddress ?? "Connect MetaMask"}
        >
          {connecting
            ? "connecting..."
            : walletAddress
              ? shortenAddress(walletAddress)
              : "wallet"}
        </Button>
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
      <Dialog>
        <DialogTrigger>How to play?</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to play</DialogTitle>
            <DialogDescription>
              <div className="space-y-3">
                <ul className="list-disc space-y-1 pl-4 text-base">
                  <li>Board 4×4: 15 coins and 1 bomb.</li>
                  <li>
                    Tap a cell to reveal it. A coin increases progress; a bomb
                    ends the round with a loss.
                  </li>
                  <li>
                    Tap and hold to place/remove a flag (mark a suspected bomb).
                  </li>
                  <li>
                    Bet: enter an amount and press Bet — the amount is deducted
                    and the round starts.
                  </li>
                  <li>
                    Win: if you reveal all coins, you get x2 of your bet back to
                    balance.
                  </li>
                  <li>Lose: if you reveal the bomb, the bet is lost.</li>
                  <li>You cannot change the bet while the round is active.</li>
                </ul>
                <span className="text-muted-foreground text-sm">
                  Tip: use flags to avoid tapping suspected bombs.
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
