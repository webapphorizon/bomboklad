"use client";

import gsap from "gsap";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const coinRef = useRef<HTMLDivElement | null>(null);
  const bombRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (state !== `revealed`) return;

    if (type === `coin` && coinRef.current) {
      gsap.fromTo(
        coinRef.current,
        { scale: 0.2, opacity: 0, rotate: -30 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.2,
          ease: `back.out(1.7)`,
        },
      );
    }

    if (type === `bomb` && bombRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        bombRef.current,
        { scale: 0.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: `back.out(2)` },
      )
        .to(bombRef.current, {
          rotate: -8,
          duration: 0.05,
          yoyo: true,
          repeat: 5,
          ease: `sine.inOut`,
        })
        .to(bombRef.current, { rotate: 0, duration: 0.1 });
    }
  }, [state, type]);

  const handleClick = () => {
    if (state === `hidden` || state === `flagged`) onReveal();
  };

  const handleContextMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (state !== `revealed`) onToggleFlag();
  };

  return (
    <div className={`relative h-20 w-20`}>
      <div
        className={`pointer-events-none absolute inset-0 top-2 z-0 h-20 w-20 rounded-md bg-slate-900`}
      />
      <Button
        className={`bg-primary-foreground relative z-10 flex h-full w-full items-center justify-center`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        disabled={state === `revealed`}
      >
        {state === `flagged` && (
          <span className={`absolute top-1 right-1 text-lg`}>🚩</span>
        )}
        {state === `revealed` && type === `coin` && (
          <div ref={coinRef} className={`will-change-transform`}>
            <Image src={`/coin2.png`} alt={`coin`} width={38} height={38} />
          </div>
        )}
        {state === `revealed` && type === `bomb` && bombData && (
          <div ref={bombRef} className={`will-change-transform`}>
            <Lottie
              animationData={bombData}
              loop
              autoplay
              style={{ width: 42, height: 42 }}
            />
          </div>
        )}
      </Button>
    </div>
  );
}
