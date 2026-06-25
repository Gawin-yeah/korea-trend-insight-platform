import { testSources } from "@/lib/sources/testing";
import type { Platform } from "@/types/trend";

async function main() {
  const platform = process.argv[2] as Platform | undefined;
  const results = await testSources(platform);

  if (!results.length) {
    console.log("No matching source adapter.");
    process.exit(1);
  }

  for (const result of results) {
    console.log(`\n[${result.platform}] ${result.status}`);
    console.log(`message: ${result.message}`);
    console.log(`fetchedCount: ${result.fetchedCount}`);
    if (result.sampleTerms.length) {
      console.log(`sampleTerms: ${result.sampleTerms.join(", ")}`);
    }
    if (result.sampleUrls.length) {
      console.log(`sampleUrls: ${result.sampleUrls.join(" | ")}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

