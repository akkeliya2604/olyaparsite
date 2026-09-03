#!/usr/bin/env node
/**
 * Wrangler wrapper that pins Cloudflare credentials to THIS project.
 *
 * Why this exists
 * ---------------
 * `wrangler login` writes its OAuth token to a single machine-wide location
 * (on Windows: %APPDATA%\xdg.config\.wrangler\config\default.toml). Logging in
 * to a second Cloudflare account would silently overwrite the first one, so
 * every other project and shell on this machine would start deploying to the
 * wrong account.
 *
 * Wrangler resolves that directory from XDG_CONFIG_HOME. This wrapper points it
 * at .cf-home/ inside the repo, for the spawned process only. The result is a
 * per-project credential store -- conceptually a Python venv, but for Cloudflare:
 *
 *   npm run cf:login     -> logs in, stores the token in ./.cf-home/
 *   wrangler ... (bare)  -> still uses the machine-wide account, untouched
 *
 * .cf-home/ holds a live OAuth token and is gitignored. Never commit it.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const cfHome = join(repoRoot, ".cf-home");

mkdirSync(cfHome, { recursive: true });

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: node scripts/cf.mjs <wrangler args>");
  process.exit(1);
}

const child = spawn("npx", ["wrangler", ...args], {
  cwd: repoRoot,
  stdio: "inherit",
  // shell:true so this resolves npx.cmd on Windows as well as npx on POSIX.
  shell: true,
  env: {
    ...process.env,
    XDG_CONFIG_HOME: cfHome,
  },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
