import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { queryMany } from "@/lib/db";

async function main() {
  const schemaPath = join(process.cwd(), "db", "schema.sql");
  const sql = await readFile(schemaPath, "utf8");
  await queryMany(sql);
  console.log("Database schema applied.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

