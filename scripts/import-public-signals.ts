import { runPublicSignalImportJob } from "@/lib/pipeline/ingest";

async function main() {
  const result = await runPublicSignalImportJob();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

