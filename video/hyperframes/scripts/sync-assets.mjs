import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(projectRoot, "../..");
const assetsRoot = path.join(projectRoot, "assets");

const mappings = [
  ["public/images/cases/01-analysis.jpg", "01-analysis.jpg"],
  ["public/images/cases/03-training.png", "03-training.png"],
  ["public/images/product/pitching-feedback.webp", "pitching-feedback.webp"],
  ["app/icon.svg", "corporate-icon.svg"],
];

const checkOnly = process.argv.includes("--check");
if (process.argv.slice(2).some((arg) => arg !== "--check")) {
  throw new Error("Usage: node scripts/sync-assets.mjs [--check]");
}
if (!checkOnly) mkdirSync(assetsRoot, { recursive: true });

const sha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

for (const [origin, basename] of mappings) {
  const source = path.join(repositoryRoot, origin);
  const destination = path.join(assetsRoot, basename);
  if (!existsSync(source)) throw new Error("Missing source asset: " + source);
  const sourceHash = sha256(source);
  const matches = existsSync(destination) && sha256(destination) === sourceHash;
  if (!matches && checkOnly) throw new Error("Missing or stale generated asset: " + destination);
  if (!matches) copyFileSync(source, destination);
  if (sha256(destination) !== sourceHash) throw new Error("Asset hash mismatch: " + basename);
  console.log((matches ? "VERIFIED " : "SYNCED ") + basename + " <- " + origin);
}

console.log(checkOnly ? "Asset verification PASS" : "Asset sync PASS");
