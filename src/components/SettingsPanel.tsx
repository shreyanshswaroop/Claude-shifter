import { shiftGears } from "../gearConfig";
import type { GearModels, ShiftGear } from "../gearConfig";

type Props = {
  gearModels: GearModels;
  setGearModels: (models: GearModels) => void;
};

const gearNames: Record<ShiftGear, string> = {
  "1": "Gear 1",
  "2": "Gear 2",
  "3": "Gear 3",
  "4": "Gear 4",
  "5": "Gear 5",
  R: "Reverse",
};

export default function SettingsPanel({ gearModels, setGearModels }: Props) {
  function updateGear(gear: ShiftGear, model: string) {
    setGearModels({
      ...gearModels,
      [gear]: model,
    });
  }

  return (
    <div className="border-t border-[#303030] bg-[#101010] px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-sm font-bold uppercase tracking-[3px] text-zinc-300">
          Settings
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-600">
          Gear Models
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {shiftGears.map((gear) => (
          <label
            key={gear}
            className="flex items-center gap-2 rounded border border-zinc-800 bg-black/35 px-2 py-2"
          >
            <span className="w-12 shrink-0 font-mono text-[11px] font-bold uppercase tracking-[1px] text-orange-400">
              {gearNames[gear]}
            </span>
            <input
              value={gearModels[gear]}
              onChange={(event) => updateGear(gear, event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-mono text-xs text-zinc-200 outline-none placeholder:text-zinc-700"
              placeholder="Model"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
