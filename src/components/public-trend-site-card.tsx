import type { PublicTrendSite } from "@/types/trend";

export function PublicTrendSiteCard({ site }: { site: PublicTrendSite }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{site.accessMode}</p>
      <h3 className="mt-2 text-xl font-semibold text-white">{site.displayName}</h3>
      <p className="mt-4 text-sm leading-6 text-slate-200">{site.signalRole}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{site.coverage}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {site.bestFor.map((item) => (
          <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {item}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{site.limitations}</p>
      {site.regionHint ? (
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-200">{site.regionHint}</p>
      ) : null}
    </div>
  );
}

