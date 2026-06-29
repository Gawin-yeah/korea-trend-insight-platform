import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = process.env.STATIC_SITE_ORIGIN || "http://localhost:3012";
const basePath = process.env.STATIC_SITE_BASE_PATH || "/korea-trend-insight-platform";
const outputDir = path.resolve(process.cwd(), "work", "github-pages-root");

function normalizePathname(pathname: string) {
  const maybeTrimmed =
    pathname.endsWith("/") && path.extname(pathname.slice(0, -1)) ? pathname.slice(0, -1) : pathname;

  pathname = maybeTrimmed;

  if (pathname === basePath || pathname === `${basePath}/`) {
    return "/";
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length);
  }

  return pathname;
}

function toFilePath(url: URL) {
  const relative = normalizePathname(url.pathname);

  if (relative === "/") {
    return path.join(outputDir, "index.html");
  }

  const hasExtension = path.extname(relative) !== "";
  const trimmed = relative.replace(/^\/+/, "");

  if (hasExtension) {
    return path.join(outputDir, trimmed);
  }

  return path.join(outputDir, trimmed, "index.html");
}

function toFetchUrl(url: URL) {
  if (url.pathname === basePath || url.pathname === `${basePath}/`) {
    return url;
  }

  const pathname =
    url.pathname.endsWith("/") && path.extname(url.pathname.slice(0, -1))
      ? url.pathname.slice(0, -1)
      : url.pathname;

  if (pathname.startsWith(`${basePath}/assets/`)) {
    return new URL(pathname.slice(basePath.length), origin);
  }

  if (pathname !== url.pathname) {
    return new URL(`${origin}${pathname}`);
  }

  return url;
}

function collectLinks(text: string) {
  const found = new Set<string>();
  const patterns = [
    /(?:href|src)=["']([^"'#]+)["']/g,
    /import\(["']([^"']+)["']\)/g,
    /["'](\/korea-trend-insight-platform\/assets\/[^"']+)["']/g
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      found.add(match[1]);
    }
  }

  return Array.from(found);
}

async function saveResponse(url: URL, text: string) {
  const targetPath = toFilePath(url);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, text);
}

async function crawl() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const queue = [
    `${basePath}/`,
    `${basePath}/admin`,
    `${basePath}/admin/sources`,
    `${basePath}/admin/evidence`,
    `${basePath}/exports/trends.json`,
    `${basePath}/exports/trends.csv`
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const next = queue.shift();
    if (!next) {
      continue;
    }

    const url = new URL(next, origin);
    const key = url.toString();

    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const response = await fetch(toFetchUrl(url).toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch ${key}: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const isText =
      contentType.includes("text/") ||
      contentType.includes("application/json") ||
      contentType.includes("javascript");

    if (isText) {
      const text = await response.text();
      await saveResponse(url, text);

      for (const href of collectLinks(text)) {
        const child = new URL(href, origin);
        if (child.origin !== new URL(origin).origin) {
          continue;
        }

        if (!child.pathname.startsWith(basePath)) {
          continue;
        }

        queue.push(child.toString());
      }
      continue;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    const targetPath = toFilePath(url);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, bytes);
  }
}

crawl().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
