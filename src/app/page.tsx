"use client";

import GameGrid from "~/components/block/game-grid";
import { Button } from "~/components/ui/button";
import { Slider} from "~/components/ui/slider";

export default function HomePage() {
  return (
    <main
      className={`flex  flex-col items-center justify-center gap-10 p-4 text-white`}
    >
      <Button>add money</Button>
      <GameGrid />
      <div className="flex w-full flex-col gap-2">
        <div className="flex">
          <p>number of bombs:</p>
          <span className="pl-2">{4}</span>
        </div>
        <Slider />
      </div>
    </main>
  );
}
