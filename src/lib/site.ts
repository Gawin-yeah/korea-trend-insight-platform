export const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function isStaticSite() {
  return process.env.NEXT_PUBLIC_STATIC_SITE === "true";
}

export function toAppPath(path: string) {
  if (!path) {
    return appBasePath || "/";
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return appBasePath ? `${appBasePath}${normalized}` : normalized;
}

export function buildTrendExportHref(format: "json" | "csv", slug?: string) {
  if (!isStaticSite()) {
    if (slug) {
      return `/api/export?format=${format}&slug=${slug}&scope=source_links`;
    }

    return `/api/export?format=${format}`;
  }

  if (slug) {
    return toAppPath(`/exports/source-links/${slug}.${format}`);
  }

  return toAppPath(`/exports/trends.${format}`);
}
