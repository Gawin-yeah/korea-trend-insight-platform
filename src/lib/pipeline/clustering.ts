import { slugify } from "@/lib/utils";

export function buildClusterSlug(term: string) {
  return slugify(term);
}

export function pickCanonicalTerm(input: string) {
  return input
    .replace(/[#@]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

