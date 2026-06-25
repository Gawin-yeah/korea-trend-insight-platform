import cron from "node-cron";
import { runIngestionJob } from "@/lib/pipeline/ingest";

const cronExpression = process.env.INGESTION_CRON || "0 * * * *";

async function runOnce() {
  const result = await runIngestionJob();
  console.log(
    `[worker] completed: fetched=${result.fetchedCount}, accepted=${result.acceptedCount}, source=${result.source}`
  );
}

async function main() {
  console.log(`[worker] schedule ${cronExpression}`);
  await runOnce();

  cron.schedule(cronExpression, async () => {
    try {
      await runOnce();
    } catch (error) {
      console.error("[worker] ingestion failed", error);
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
