export default function ChevronStrip() {
  return (
    <div className="w-full overflow-hidden bg-[#0d4f4f]" style={{ height: "64px" }}>
      <div className="flex h-full items-center">
        <svg
          viewBox="0 0 1440 64"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
            {Array.from({ length: 24 }).map((_, i) => {
              const x = i * 60;
              return (
                <g key={i}>
                  {/* Chevron arrow */}
                  <polyline
                    points={`${x},8 ${x + 30},32 ${x},56`}
                    fill="none"
                    stroke="#00c4cc"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.4"
                  />
                  <polyline
                    points={`${x + 15},8 ${x + 45},32 ${x + 15},56`}
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                  />
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
}