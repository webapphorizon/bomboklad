"use client";

import GameGrid from "~/components/block/game-grid";
import { Button } from "~/components/ui/button";
import { Slider} from "~/components/ui/slider";

export default function HomePage() {
  return (
    <main
      className={`flex max-h-screen flex-col items-center justify-center gap-4 p-4 text-white`}
    >
      <div>
        <h1 className="text-3xl font-medium">Balance: 100$</h1>
      </div>
      <GameGrid />
      <div className="flex w-full flex-col gap-2">
        <div className="flex">
          <p>number of bombs:</p>
          <span className="pl-2">{4}</span>
        </div>
        <Slider />
        <div>
          <p>you can x4 your bet</p>
        </div>
      </div>
      <Button className="h-16 w-32 text-3xl font-bold uppercase">bet</Button>
    </main>
  );
}
