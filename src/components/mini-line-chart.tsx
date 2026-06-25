export function MiniLineChart({
  values
}: {
  values: number[];
}) {
  if (!values.length) {
    return (
      <div className="flex h-24 items-center justify-center rounded-2xl bg-white/5 text-sm text-slate-400">
        暂无曲线数据
      </div>
    );
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <svg viewBox="0 0 100 100" className="h-24 w-full">
        <defs>
          <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.55)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.05)" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#67e8f9"
          strokeWidth="3"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

