import type { Gear } from "../gearConfig";
import type { GearModels } from "../gearConfig";

export default function Terminal({ gear, gearModels }: { gear: Gear; gearModels: GearModels }) {
  const isNeutral = gear === "N";
  const model = gearModels[gear];
  const command =
    isNeutral ? "neutral"
    : gear === "R" && model.toLowerCase() === "default" ? "/model"
    : `/model ${model}`;
  const gearNumber = isNeutral ? "0" : gear;

  return (
    <div className="min-h-[86px] bg-[#080808] border-b border-[#303030] px-5 py-3 font-mono">
      <div className="flex h-8 items-center gap-3 text-sm">
        <span className="w-8 h-8 rounded-md border border-zinc-700 flex items-center justify-center text-zinc-300">
          ‹
        </span>
        <span className="text-orange-400 font-bold">● gearshift:{gearNumber}.0</span>
        <span className="text-zinc-500">-</span>
        <span className="text-zinc-500">2.1...</span>
        <span className="ml-auto text-zinc-500">D U ★ X</span>
      </div>

      <div className="mt-2 flex min-w-0 items-center gap-2 text-sm leading-5 text-zinc-300">
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{command}</span>
        <span className="shrink-0 text-zinc-600">- gearshift::{gearNumber}.0</span>
        {!isNeutral && <span className="text-green-500">✓</span>}
      </div>
    </div>
  );
}
