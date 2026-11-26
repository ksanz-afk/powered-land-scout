// MapLibre loads tiles in a web worker it locates with `new URL(..., import.meta.url)`.
// The Next.js bundler doesn't emit that file, so the worker 404s and tiles never draw.
// Copy the worker from the installed package into public/ before dev and build,
// so it always matches the installed version. sites-map.tsx points MapLibre at it.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs");
const dest = join(root, "public/vendor/maplibre-gl-worker.mjs");
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log("Copied MapLibre worker to public/vendor/");
