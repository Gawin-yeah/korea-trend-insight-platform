import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { publicSignalSnapshots } from "@/lib/public-signal-importers/snapshots";

export const youtubeChartsImporter: PublicSignalImporter = {
  name: "youtube_charts",
  displayName: "YouTube Charts Snapshot Importer",
  async importSignals() {
    return publicSignalSnapshots.filter((item) => item.sourcePlatform === "youtube_charts");
  }
};

