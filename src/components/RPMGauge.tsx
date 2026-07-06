import type { Gear } from "../gearConfig";
import type { GearModels } from "../gearConfig";

const rpmMap: Record<Gear, number> = {
  N: 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  R: 0.8,
};
const maxRpm = 6;
const redStartRpm = 5;
const fullGaugeArc = "M25 105 A85 85 0 0 1 195 105";
const redArc = "M174 56 A85 85 0 0 1 195 105";

export default function RPMGauge({ gear, gearModels }: { gear: Gear; gearModels: GearModels }) {
  const rpm = rpmMap[gear];
  const rotation = -90 + rpm * 30;
  const yellowProgress = Math.min(rpm, redStartRpm) / maxRpm;
  const redProgress = Math.max(0, rpm - redStartRpm) / (maxRpm - redStartRpm);
  const displayGear = gear === "N" ? "0" : gear;

  return (
    <div className="h-[160px] bg-[radial-gradient(circle_at_26%_50%,#111_0%,#030303_58%,#000_100%)] border-b border-[#303030] px-6 py-5 flex items-center justify-between">
      <div className="relative w-[190px] h-[115px] drop-shadow-[0_0_18px_rgba(255,45,45,0.12)]">
        <svg viewBox="0 0 220 130" className="w-full h-full">
          <defs>
            <filter id="rpmGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="needlePaint" x1="0" x2="1">
              <stop offset="0%" stopColor="#ff1f1f" />
              <stop offset="65%" stopColor="#ff4a2f" />
              <stop offset="100%" stopColor="#fff1df" />
            </linearGradient>
            <linearGradient id="rpmBasePaint" x1="25" y1="105" x2="195" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#202020" />
              <stop offset="72%" stopColor="#282828" />
              <stop offset="84%" stopColor="#4a2525" />
              <stop offset="100%" stopColor="#ff2424" stopOpacity="0.58" />
            </linearGradient>
          </defs>
          <path
            d={fullGaugeArc}
            fill="none"
            stroke="url(#rpmBasePaint)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={fullGaugeArc}
            fill="none"
            stroke="#555"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={fullGaugeArc}
            fill="none"
            pathLength="1"
            stroke="#f8f8ef"
            strokeDasharray="1"
            strokeDashoffset={1 - yellowProgress}
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#rpmGlow)"
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
          <path
            d={redArc}
            fill="none"
            pathLength="1"
            stroke="#ff2424"
            strokeDasharray="1"
            strokeDashoffset={1 - redProgress}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#rpmGlow)"
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          {[0, 1, 2, 3, 4, 5, 6].map((n) => {
            const angle = -180 + n * 30;
            const rad = (angle * Math.PI) / 180;
            const x1 = 110 + Math.cos(rad) * 72;
            const y1 = 105 + Math.sin(rad) * 72;
            const x2 = 110 + Math.cos(rad) * 88;
            const y2 = 105 + Math.sin(rad) * 88;

            return (
              <g key={n}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={n >= 5 ? "#ff2f2f" : "#f8f8ef"}
                  strokeWidth={n >= 5 ? 4 : 3}
                  strokeLinecap="round"
                />
                <text
                  x={110 + Math.cos(rad) * 55}
                  y={108 + Math.sin(rad) * 55}
                  fill={n >= 5 ? "#ff2f2f" : "#f8f8ef"}
                  fontSize="17"
                  fontStyle="italic"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {n}
                </text>
              </g>
            );
          })}

          <polygon
            points="106,105 110,27 114,105"
            fill="url(#needlePaint)"
            stroke="#ffdad0"
            strokeWidth="0.6"
            filter="url(#rpmGlow)"
            style={{
              transformBox: "view-box",
              transformOrigin: "110px 105px",
              transform: `rotate(${rotation}deg)`,
              transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <circle cx="110" cy="105" r="18" fill="#020202" stroke="#343434" strokeWidth="5" />
          <circle cx="110" cy="105" r="12" fill="#050505" stroke="#f8f8ef" strokeOpacity="0.75" strokeWidth="2" />
          <text
            x="110"
            y="80"
            fill="#d8d2bd"
            fontSize="10"
            fontStyle="italic"
            fontWeight="800"
            textAnchor="middle"
          >
            x1000 rpm
          </text>
        </svg>
      </div>

      <div className="relative min-w-[118px] text-right">
        <div className="absolute right-0 top-1/2 h-[104px] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-red-400/35 to-transparent" />
        <div className="absolute right-5 top-0 h-[92px] w-[92px] rounded-full bg-red-500/10 blur-2xl" />

        <div className="relative pr-4">
          <div className="text-[76px] leading-[0.82] font-black text-red-400 drop-shadow-[0_0_18px_rgba(248,113,113,0.72)]">
            {displayGear}
          </div>
          <div className="mt-4 inline-flex h-[34px] w-[118px] items-center justify-center gap-2 rounded-sm border border-orange-400/20 bg-orange-400/5 px-2 py-1 font-mono text-[12px] font-black uppercase tracking-[3px] text-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.08)]">
            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {gearModels[gear]}
            </span>
            {gear !== "N" && <span className="tracking-[2px]">{rpm.toFixed(1)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
