#!/usr/bin/env node
/**
 * GitHub Pages용 산출물: dist/ 에 전사이트 복사 후 JS/CSS만 압축(경로·파일명 동일).
 * 로컬: npm run build:pages
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { minify as terserMinify } from "terser";
import cleanCssMod from "clean-css";
const CleanCSS = cleanCssMod.default ?? cleanCssMod;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const SKIP_TOP = new Set([
  "node_modules",
  ".git",
  "dist",
  ".github",
  "next-core-values",
  "terminals",
  ".cursor",
  "package.json",
  "package-lock.json",
]);

async function copyDir(src, dest, isRoot = true) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true });
  for (const e of entries) {
    if (isRoot && SKIP_TOP.has(e.name)) continue;
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      await copyDir(s, d, false);
    } else {
      await fs.copyFile(s, d);
    }
  }
}

async function minifyJsTree(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      await minifyJsTree(p);
    } else if (e.name.endsWith(".js") && !e.name.endsWith(".min.js")) {
      const src = await fs.readFile(p, "utf8");
      const r = await terserMinify(src, {
        compress: { passes: 2, dead_code: true },
        mangle: false,
        format: { comments: false },
      });
      if (r.code) {
        await fs.writeFile(p, r.code);
      }
    }
  }
}

async function minifyMainCss() {
  const file = path.join(DIST, "css", "style.css");
  try {
    const src = await fs.readFile(file, "utf8");
    const out = new CleanCSS({ level: 2 }).minify(src);
    if (out.errors?.length) {
      console.warn("[clean-css]", out.errors);
    }
    await fs.writeFile(file, out.styles);
  } catch (e) {
    console.warn("skip css minify:", e.message);
  }
}

async function main() {
  await fs.rm(DIST, { recursive: true, force: true });
  await copyDir(ROOT, DIST, true);
  await minifyJsTree(path.join(DIST, "js"));
  await minifyMainCss();
  console.log("build-github-pages: OK →", DIST);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
