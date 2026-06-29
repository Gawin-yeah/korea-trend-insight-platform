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

export function getSiteModeSummary() {
  if (isStaticSite()) {
    return {
      label: "静态正式站",
      description:
        "当前公网版是静态演示，不会自动拉取韩国最新热点；页面展示的是上次构建时固化下来的趋势样本。"
    };
  }

  return {
    label: "动态应用",
    description:
      "当前环境可接入数据库、定时任务和官方 API，用于持续刷新韩国最新热点。"
    };
}
