import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { fallbackSnapshotSignals } from "@/lib/public-signal-importers/utils";

export const tiktokCreativeCenterImporter: PublicSignalImporter = {
  name: "tiktok_creative_center",
  displayName: "TikTok Creative Center Snapshot Importer",
  getMode() {
    return "snapshot";
  },
  async importSignals() {
    return fallbackSnapshotSignals("tiktok_creative_center");
  }
};
