import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { publicSignalSnapshots } from "@/lib/public-signal-importers/snapshots";

export const googleTrendsImporter: PublicSignalImporter = {
  name: "google_trends",
  displayName: "Google Trends Snapshot Importer",
  async importSignals() {
    return publicSignalSnapshots.filter((item) => item.sourcePlatform === "google_trends");
  }
};

