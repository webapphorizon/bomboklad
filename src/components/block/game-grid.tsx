
import CustomGameButton from "~/components/ui/custom-game-button";

const GameGrid = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />
      <CustomGameButton
        onClick={(result: "bomb" | "coin") => {
          console.log(result);
        }}
      />{" "}
    </div>
  );
};

export default GameGrid;