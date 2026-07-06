import type { Gear, GearModels } from "../gearConfig";
import RPMGauge from "./RPMGauge";
import Terminal from "./Terminal";
import GearGate from "./GearGate";
import StatusBar from "./StatusBar";
import SettingsPanel from "./SettingsPanel";

type Props = {
  gear: Gear;
  gearModels: GearModels;
  setGear: (gear: Gear) => void;
  setGearModels: (models: GearModels) => void;
};

export default function Dashboard({ gear, gearModels, setGear, setGearModels }: Props) {
  return (
    <div className="w-[420px] rounded-[28px] overflow-hidden border border-[#303030] bg-[#171717] shadow-2xl">
      <RPMGauge gear={gear} gearModels={gearModels} />
      <Terminal gear={gear} gearModels={gearModels} />
      <GearGate gear={gear} gearModels={gearModels} setGear={setGear} />
      <SettingsPanel gearModels={gearModels} setGearModels={setGearModels} />
      <StatusBar gear={gear} gearModels={gearModels} />
    </div>
  );
}
