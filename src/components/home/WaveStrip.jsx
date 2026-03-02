export default function WaveStrip() {
  return (
    <div className="w-full overflow-hidden bg-[#0a1628]" style={{ height: "72px" }}>
      <div className="flex h-full items-center">
        <svg
          viewBox="0 0 1440 72"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
            {/* Repeating tapa-inspired geometric pattern */}
            {Array.from({ length: 20 }).map((_, i) => {
              const x = i * 72;
              return (
                <g key={i} transform={`translate(${x}, 0)`}>
                  {/* Outer diamond */}
                  <polygon
                    points="36,4 68,36 36,68 4,36"
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="1.2"
                    opacity="0.5"
                  />
                  {/* Inner diamond */}
                  <polygon
                    points="36,16 56,36 36,56 16,36"
                    fill="none"
                    stroke="#00c4cc"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  {/* Centre dot */}
                  <circle cx="36" cy="36" r="3" fill="#c9a84c" opacity="0.6" />
                  {/* Corner dots */}
                  <circle cx="36" cy="4" r="2" fill="#00c4cc" opacity="0.4" />
                  <circle cx="68" cy="36" r="2" fill="#00c4cc" opacity="0.4" />
                  <circle cx="36" cy="68" r="2" fill="#00c4cc" opacity="0.4" />
                  <circle cx="4" cy="36" r="2" fill="#00c4cc" opacity="0.4" />
                  {/* Cross lines */}
                  <line x1="36" y1="16" x2="36" y2="56" stroke="#c9a84c" strokeWidth="0.6" opacity="0.25" />
                  <line x1="16" y1="36" x2="56" y2="36" stroke="#c9a84c" strokeWidth="0.6" opacity="0.25" />
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
}