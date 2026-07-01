import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { fallbackSnapshotSignals } from "@/lib/public-signal-importers/utils";

export const naverDataLabImporter: PublicSignalImporter = {
  name: "naver_datalab",
  displayName: "Naver DataLab Snapshot Importer",
  getMode() {
    return process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET
      ? "hybrid"
      : "snapshot";
  },
  async importSignals() {
    return fallbackSnapshotSignals("naver_datalab");
  }
};
