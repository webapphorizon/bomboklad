"use client";

import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

type BombAnimation = Record<string, unknown>;

interface CustomGameButtonProps {
  onClick: (result: "bomb" | "coin") => void;
}

export default function CustomGameButton({ onClick }: CustomGameButtonProps) {
  const [isShown, setIsShown] = useState(false);
  const [choice, setChoice] = useState<"bomb" | "coin" | null>(null);
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
    if (!isShown) {
      const canShowBomb = Boolean(bombData);
      const available: Array<"bomb" | "coin"> = canShowBomb
        ? ["bomb", "coin"]
        : ["coin"];
      const idx = Math.floor(Math.random() * available.length);
      const selected: "bomb" | "coin" = available[idx] ?? "coin";
      setChoice(selected);
      setIsShown(true);
      onClick(selected);
      return;
    }
    if (choice === "bomb" || choice === "coin") onClick(choice);
  };

  return (
    <Button
      className={`flex h-20 w-20 items-center justify-center bg-primary-foreground`}
      onClick={handleClick}
    >
      <div className={isShown ? `block` : `hidden`}>
        {choice === `coin` && (
          <Image src={`/coin2.png`} alt={`coin`} width={38} height={38} />
        )}
        {choice === `bomb` && bombData && (
          <Lottie
            animationData={bombData}
            loop
            autoplay
            style={{ width: 42, height: 42 }}
          />
        )}
      </div>
    </Button>
  );
}
