import { Slider } from "~/components/ui/slider";

const CustomSlider = () => {
  return (
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
  );
};

export default CustomSlider;
