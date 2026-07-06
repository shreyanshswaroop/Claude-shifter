import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import type { Gear } from "../gearConfig";
import type { GearModels } from "../gearConfig";
import gearPlate from "../assets/gearPlate.svg";

type Props = {
  gear: Gear;
  gearModels: GearModels;
  setGear: (gear: Gear) => void;
};

type Position = {
  x: number;
  y: number;
};
type Segment = {
  from: Position;
  to: Position;
};
type ShiftGear = Exclude<Gear, "N">;

const knobSize = 86;
const gateSize = {
  width: 360,
  height: 470,
};
const plate = {
  left: 10,
  top: 65,
  size: 340,
  viewBox: 420,
};

const slotCenters = {
  left: 108,
  middle: 210,
  right: 312,
  top: 62,
  bottom: 360,
};
const snapRadius = 46;
const keyboardStep = 34;
const springTransition = {
  type: "spring",
  stiffness: 380,
  damping: 24,
} as const;
const gateResistanceTransition = {
  type: "spring",
  stiffness: 520,
  damping: 32,
} as const;

function platePoint(x: number, y: number): Position {
  const scale = plate.size / plate.viewBox;

  return {
    x: clamp(plate.left + x * scale, knobSize / 2, gateSize.width - knobSize / 2),
    y: clamp(plate.top + y * scale, knobSize / 2, gateSize.height - knobSize / 2),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function knobTarget(position: Position) {
  return {
    x: position.x - knobSize / 2,
    y: position.y - knobSize / 2,
  };
}

const gearPositions: Record<ShiftGear, Position> = {
  "1": platePoint(slotCenters.left, slotCenters.top),
  "2": platePoint(slotCenters.left, slotCenters.bottom),
  "3": platePoint(slotCenters.middle, slotCenters.top),
  "4": platePoint(slotCenters.middle, slotCenters.bottom),
  "5": platePoint(slotCenters.right, slotCenters.top),
  R: platePoint(slotCenters.right, slotCenters.bottom),
};
const neutralPosition = platePoint(slotCenters.middle, 210);

const gateSegments: Segment[] = [
  { from: gearPositions["1"], to: gearPositions["2"] },
  { from: gearPositions["3"], to: gearPositions["4"] },
  { from: gearPositions["5"], to: gearPositions.R },
  {
    from: { x: gearPositions["1"].x, y: neutralPosition.y },
    to: { x: gearPositions.R.x, y: neutralPosition.y },
  },
];

const gearPositionList = Object.values(gearPositions);
const dragBounds = {
  left: Math.min(...gearPositionList.map((position) => position.x)) - knobSize / 2,
  top: Math.min(...gearPositionList.map((position) => position.y)) - knobSize / 2,
  right: Math.max(...gearPositionList.map((position) => position.x)) + knobSize / 2,
  bottom: Math.max(...gearPositionList.map((position) => position.y)) + knobSize / 2,
};

const slotMouths: Record<ShiftGear, Position> = {
  "1": platePoint(slotCenters.left, 160),
  "2": platePoint(slotCenters.left, 260),
  "3": platePoint(slotCenters.middle, 160),
  "4": platePoint(slotCenters.middle, 260),
  "5": platePoint(slotCenters.right, 160),
  R: platePoint(slotCenters.right, 260),
};

const gearLabels: Array<{
  gear: ShiftGear;
  position: Position;
  vertical: "top" | "bottom";
}> = [
  { gear: "1", position: gearPositions["1"], vertical: "top" },
  { gear: "3", position: gearPositions["3"], vertical: "top" },
  { gear: "5", position: gearPositions["5"], vertical: "top" },
  { gear: "2", position: gearPositions["2"], vertical: "bottom" },
  { gear: "4", position: gearPositions["4"], vertical: "bottom" },
  { gear: "R", position: gearPositions.R, vertical: "bottom" },
];

function getNearestGear(position: Position): ShiftGear | null {
  let nearest: ShiftGear = "3";
  let shortest = Infinity;

  for (const gear of Object.keys(gearPositions) as ShiftGear[]) {
    const target = gearPositions[gear];
    const distance = Math.hypot(position.x - target.x, position.y - target.y);

    if (distance < shortest) {
      shortest = distance;
      nearest = gear;
    }
  }

  return shortest <= snapRadius ? nearest : null;
}

function closestPointOnSegment(position: Position, segment: Segment): Position {
  const dx = segment.to.x - segment.from.x;
  const dy = segment.to.y - segment.from.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return segment.from;
  }

  const t = clamp(
    ((position.x - segment.from.x) * dx + (position.y - segment.from.y) * dy) /
      lengthSquared,
    0,
    1,
  );

  return {
    x: segment.from.x + dx * t,
    y: segment.from.y + dy * t,
  };
}

function projectToGate(position: Position): Position {
  let closest = neutralPosition;
  let shortest = Infinity;

  for (const segment of gateSegments) {
    const point = closestPointOnSegment(position, segment);
    const distance = Math.hypot(position.x - point.x, position.y - point.y);

    if (distance < shortest) {
      closest = point;
      shortest = distance;
    }
  }

  return closest;
}

function getGearAtPosition(position: Position): ShiftGear | null {
  for (const gear of Object.keys(gearPositions) as ShiftGear[]) {
    const target = gearPositions[gear];

    if (Math.hypot(position.x - target.x, position.y - target.y) < 1) {
      return gear;
    }
  }

  return null;
}

export default function GearGate({ gear, gearModels, setGear }: Props) {
  const knobControls = useAnimationControls();
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>(
    gear === "N" ? neutralPosition : gearPositions[gear],
  );
  const snappedGear = (Object.keys(gearPositions) as ShiftGear[]).find(
    (nextGear) => gearPositions[nextGear] === position,
  );
  const slotMouth = snappedGear ? slotMouths[snappedGear] : neutralPosition;
  const stalk = {
    length: snappedGear
      ? Math.hypot(slotMouth.x - position.x, slotMouth.y - position.y) + knobSize / 2
      : 0,
    angle:
      snappedGear ?
        (Math.atan2(slotMouth.y - position.y, slotMouth.x - position.x) * 180) / Math.PI
      : 0,
  };

  function snapTo(nextPosition: Position) {
    setPosition(nextPosition);
    knobControls.start(knobTarget(nextPosition));
  }

  function commitGear(nextGear: Gear) {
    setGear(nextGear);
  }

  async function selectGear(nextGear: ShiftGear) {
    commitGear(nextGear);
    snapTo(gearPositions[nextGear]);

    const model = gearModels[nextGear];
    const command =
      nextGear === "R" && model.toLowerCase() === "default" ? "/model" : `/model ${model}`;
    await navigator.clipboard.writeText(command);
  }

  function selectNeutral() {
    commitGear("N");
    snapTo(neutralPosition);
  }

  function moveByKeyboard(delta: Position) {
    const nextPosition = projectToGate({
      x: position.x + delta.x,
      y: position.y + delta.y,
    });
    const nextGear = getGearAtPosition(nextPosition);

    if (nextGear) {
      void selectGear(nextGear);
      return;
    }

    commitGear("N");
    snapTo(nextPosition);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const directGear = key === "r" ? "R" : key;

      if (directGear === "n") {
        event.preventDefault();
        selectNeutral();
        return;
      }

      if (directGear in gearPositions) {
        event.preventDefault();
        void selectGear(directGear as ShiftGear);
        return;
      }

      const arrowMoves: Record<string, Position> = {
        arrowup: { x: 0, y: -keyboardStep },
        arrowdown: { x: 0, y: keyboardStep },
        arrowleft: { x: -keyboardStep, y: 0 },
        arrowright: { x: keyboardStep, y: 0 },
      };
      const move = arrowMoves[key];

      if (move) {
        event.preventDefault();
        moveByKeyboard(move);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="h-[510px] bg-[#181818] flex items-center justify-center">
      <div className="relative w-[360px] h-[470px] rounded-[28px] bg-gradient-to-b from-[#202020] to-[#0f0f0f] border border-[#2d2d2d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_30px_60px_rgba(0,0,0,0.5)]">
        {gearLabels.map(({ gear, position, vertical }) => (
          <button
            key={gear}
            type="button"
            onClick={() => selectGear(gear)}
            className={`absolute z-10 w-[92px] -translate-x-1/2 text-center text-white ${
              vertical === "top" ? "top-5" : "bottom-5"
            }`}
            style={{ left: position.x }}
          >
            <div className="text-3xl font-bold leading-none">{gear}</div>
            <div
              className="mx-auto mt-3 h-4 max-w-[86px] overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] uppercase tracking-[2px] text-zinc-400"
              title={gearModels[gear]}
            >
              {gearModels[gear]}
            </div>
          </button>
        ))}

        <img
            src={gearPlate}
            className="absolute left-[10px] top-[65px] w-[340px] h-[340px] select-none pointer-events-none"
            />

        <div
          ref={dragBoundsRef}
          className="absolute pointer-events-none"
          style={{
            left: dragBounds.left,
            top: dragBounds.top,
            width: dragBounds.right - dragBounds.left,
            height: dragBounds.bottom - dragBounds.top,
          }}
        />

        <motion.div
          drag
          dragConstraints={dragBoundsRef}
          dragMomentum={false}
          dragElastic={0.08}
          initial={knobTarget(position)}
          animate={knobControls}
          transition={gateResistanceTransition}
          onDrag={(_, info) => {
            const projectedPosition = projectToGate({
              x: position.x + info.offset.x,
              y: position.y + info.offset.y,
            });

            knobControls.set(knobTarget(projectedPosition));
          }}
          onDragEnd={(_, info) => {
            const nextPosition = projectToGate({
              x: position.x + info.offset.x,
              y: position.y + info.offset.y,
            });

            const nearest = getNearestGear(nextPosition);

            if (nearest) {
              selectGear(nearest);
              return;
            }

            selectNeutral();
          }}
          className="absolute left-0 top-0 z-20 w-[86px] h-[86px] rounded-full cursor-grab active:cursor-grabbing"
        >
          <motion.div
            animate={{
              height: stalk.length,
              opacity: snappedGear ? 1 : 0,
              rotate: stalk.angle - 90,
            }}
            transition={springTransition}
            className="absolute left-1/2 top-1/2 z-0 w-[16px] -translate-x-1/2 origin-top rounded-full border border-[#d6d9dc]/45 bg-gradient-to-r from-[#5c6268] via-[#d8dde0] to-[#363b40] shadow-[0_10px_18px_rgba(0,0,0,0.55),inset_2px_0_3px_rgba(255,255,255,0.45),inset_-3px_0_4px_rgba(0,0,0,0.38)]"
          />

          <div className="relative w-[86px] h-[86px] rounded-full bg-[radial-gradient(circle_at_32%_24%,#f7f7f7_0%,#9ca3aa_22%,#30343a_48%,#050608_82%)] border-[3px] border-[#a7adb4] shadow-[0_18px_30px_rgba(0,0,0,0.78),0_0_18px_rgba(239,68,68,0.16),inset_0_2px_4px_rgba(255,255,255,0.75),inset_0_-10px_18px_rgba(0,0,0,0.55)] flex items-center justify-center">
            <div className="absolute inset-[8px] rounded-full border border-white/10" />
            <div className="text-white text-[13px] font-black leading-[15px] tracking-[5px] text-center opacity-95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              <div>1 3 5</div>
              <div>|-|-|</div>
              <div>2 4 R</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
