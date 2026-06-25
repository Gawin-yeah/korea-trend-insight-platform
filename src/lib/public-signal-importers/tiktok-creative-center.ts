import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { publicSignalSnapshots } from "@/lib/public-signal-importers/snapshots";

export const tiktokCreativeCenterImporter: PublicSignalImporter = {
  name: "tiktok_creative_center",
  displayName: "TikTok Creative Center Snapshot Importer",
  async importSignals() {
    return publicSignalSnapshots.filter(
      (item) => item.sourcePlatform === "tiktok_creative_center"
    );
  }
};

