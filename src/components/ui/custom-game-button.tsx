"use client";

import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import type { CellState, CellType } from "~/lib/game";

type BombAnimation = Record<string, unknown>;

interface CustomGameButtonProps {
  type: CellType;
  state: CellState;
  onReveal: () => void;
  onToggleFlag: () => void;
}

export default function CustomGameButton({
  type,
  state,
  onReveal,
  onToggleFlag,
}: CustomGameButtonProps) {
  const [bombData, setBombData] = useState<BombAnimation | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/bomb.json`);
        if (!res.ok) return;
        const data: BombAnimation = (await res.json()) as BombAnimation;
        setBombData(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleClick = () => {
    if (state === `hidden` || state === `flagged`) onReveal();
  };

  const handleContextMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (state !== `revealed`) onToggleFlag();
  };

  return (
    <Button
      className={`bg-primary-foreground relative flex h-20 w-20 items-center justify-center`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      disabled={state === `revealed`}
    >
      {state === `flagged` && (
        <span className={`absolute top-1 right-1 text-lg`}>🚩</span>
      )}
      {state === `revealed` && type === `coin` && (
        <Image src={`/coin2.png`} alt={`coin`} width={38} height={38} />
      )}
      {state === `revealed` && type === `bomb` && bombData && (
        <Lottie
          animationData={bombData}
          loop
          autoplay
          style={{ width: 42, height: 42 }}
        />
      )}
    </Button>
  );
}
