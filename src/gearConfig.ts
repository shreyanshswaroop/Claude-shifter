export type Gear = "N" | "1" | "2" | "3" | "4" | "5" | "R";
export type ShiftGear = Exclude<Gear, "N">;
export type GearModels = Record<Gear, string>;
export type ShiftGearModels = Record<ShiftGear, string>;

export const defaultGearModels: GearModels = {
  N: "neutral",
  "1": "Claude Haiku",
  "2": "Claude Sonnet",
  "3": "GPT-5",
  "4": "Gemini",
  "5": "Grok",
  R: "Default",
};

export const shiftGears: ShiftGear[] = ["1", "2", "3", "4", "5", "R"];
