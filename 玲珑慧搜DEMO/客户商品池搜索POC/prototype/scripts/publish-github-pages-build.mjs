#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prototypeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(prototypeRoot, "dist", "client");
const pagesDirectory = path.resolve(prototypeRoot, "..");

if (!existsSync(source)) throw new Error("Missing Vite build output. Run npm run build first.");
copyFileSync(path.join(source, "index.html"), path.join(pagesDirectory, "index.html"));
const sourceAssets = path.join(source, "assets");
const targetAssets = path.join(pagesDirectory, "assets");
mkdirSync(targetAssets, { recursive: true });
for (const asset of readdirSync(sourceAssets).filter((name) => !name.endsWith(".inspect.ndjson"))) {
  copyFileSync(path.join(sourceAssets, asset), path.join(targetAssets, asset));
}
for (const staleFile of readdirSync(targetAssets).filter((name) => name.endsWith(".inspect.ndjson"))) unlinkSync(path.join(targetAssets, staleFile));
console.log(`Published static Pages files to ${pagesDirectory}`);
