/**
 * Check that every `var(--token)` in the package resolves to a token that
 * tokens.css actually defines.
 *
 * The failure this catches: renaming a token in tokens.css and missing one of
 * its uses in base.css or components.css. CSS does not error on an undefined
 * custom property — the declaration is simply invalid at computed-value time and
 * the property falls back to its initial value. A colour silently becomes black,
 * a duration silently becomes 0s. Nothing in a build log tells you.
 *
 *   node scripts/validate-css.mjs
 */

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const { light } = JSON.parse(await readFile(join(root, "tokens/tokens.json"), "utf8"));
const defined = new Set(Object.keys(light));

const files = (await readdir(join(root, "css"))).filter((f) => f.endsWith(".css")).sort();
const problems = [];

for (const file of files) {
  const source = await readFile(join(root, "css", file), "utf8");

  const open = (source.match(/\{/g) ?? []).length;
  const close = (source.match(/\}/g) ?? []).length;
  if (open !== close) problems.push(`${file}: ${open} '{' vs ${close} '}'`);

  // Strip comments so a token named in prose is not mistaken for a use.
  const body = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const used = new Set([...body.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1].slice(2)));
  for (const name of [...used].sort()) {
    if (!defined.has(name)) problems.push(`${file}: var(--${name}) is not defined in tokens.css`);
  }
  process.stderr.write(`  ${file.padEnd(22)} ${String(used.size).padStart(3)} var() refs\n`);
}

if (problems.length > 0) {
  process.stderr.write(`\n${problems.length} problem(s):\n${problems.map((p) => `  ${p}`).join("\n")}\n`);
  process.exit(1);
}
process.stderr.write(`\n${files.length} files, ${defined.size} tokens, all references resolve\n`);
