import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { defaultGearModels } from "./gearConfig";
import type { Gear, GearModels } from "./gearConfig";

export default function App() {
  const [gear, setGear] = useState<Gear>("N");
  const [gearModels, setGearModels] = useState<GearModels>(defaultGearModels);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,#1f1f1f,#050505_70%)] flex items-center justify-center">
      <Dashboard
        gear={gear}
        gearModels={gearModels}
        setGear={setGear}
        setGearModels={setGearModels}
      />
    </div>
  );
}
