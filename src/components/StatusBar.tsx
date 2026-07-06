import type { Gear } from "../gearConfig";
import type { GearModels } from "../gearConfig";


export default function StatusBar({ gear, gearModels }: { gear: Gear; gearModels: GearModels }) {
  const isNeutral = gear === "N";
  const model = gearModels[gear];
  const copied =
    gear === "R" && model.toLowerCase() === "default" ? "/model" : `/model ${model}`;

  return (
    <div className="h-[42px] bg-black px-5 flex items-center justify-between text-sm text-zinc-400">
      <span>
        <span className="text-green-500">●</span> Model:{" "}
        <b className="text-green-400 uppercase">{model}</b>
      </span>
      <span>{isNeutral ? "Copied: -" : `Copied: ${copied}`}</span>
    </div>
  );
}
