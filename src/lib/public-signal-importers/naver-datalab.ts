import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { publicSignalSnapshots } from "@/lib/public-signal-importers/snapshots";

export const naverDataLabImporter: PublicSignalImporter = {
  name: "naver_datalab",
  displayName: "Naver DataLab Snapshot Importer",
  async importSignals() {
    return publicSignalSnapshots.filter((item) => item.sourcePlatform === "naver_datalab");
  }
};

