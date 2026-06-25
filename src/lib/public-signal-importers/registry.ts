import { googleTrendsImporter } from "@/lib/public-signal-importers/google-trends";
import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { naverDataLabImporter } from "@/lib/public-signal-importers/naver-datalab";
import { tiktokCreativeCenterImporter } from "@/lib/public-signal-importers/tiktok-creative-center";
import { youtubeChartsImporter } from "@/lib/public-signal-importers/youtube-charts";

export const publicSignalImporterRegistry: PublicSignalImporter[] = [
  tiktokCreativeCenterImporter,
  googleTrendsImporter,
  naverDataLabImporter,
  youtubeChartsImporter
];
