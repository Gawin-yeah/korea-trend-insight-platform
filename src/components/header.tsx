import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
            Korea Native Signals
          </p>
          <Link href="/" className="mt-1 block text-xl font-semibold text-white">
            韩国流行词与趋势洞察平台
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-200">
          <Link href="/">Dashboard</Link>
          <Link href="/admin">管理后台</Link>
          <a href="/api/export?format=json" className="rounded-full bg-white/10 px-4 py-2">
            导出 JSON
          </a>
        </nav>
      </div>
    </header>
  );
}

