// Render check for every /localcheck page. Run after every data or code change and before claiming anything is verified.
//   node scripts/render-check.mjs [baseUrl] [outDir]
// With no baseUrl it serves ../public locally. Exits 1 on: pageerror, console error, failed same-origin request,
// empty body, horizontal overflow, or a nav click that does not land on the right page.
import { execSync } from "node:child_process"
import { createServer } from "node:http"
import { mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs"
import { extname, join, normalize } from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright")

const here = import.meta.dirname
const pub = join(here, "../../public")
const site = join(pub, "localcheck")
const outDir = process.argv[3] ?? join(here, "../render-check-out")
mkdirSync(outDir, { recursive: true })

const pages = readdirSync(site).filter((f) => f.endsWith(".html")).sort()
const NAV = [
  ["index.html", "Home & Court"],
  ["challenge.html", "Challenge & OTA"],
  ["roadmap.html", "Roadmap"],
  ["screens.html", "Screens"],
  ["audit.html", "PR77 audit"],
  ["findings.html", "Findings"],
  ["status.html", "Status & docs"],
]
const viewports = [
  ["phone", { width: 393, height: 852 }],
  ["desktop", { width: 1280, height: 900 }],
]

const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".md": "text/markdown", ".woff2": "font/woff2" }
let server
let base = process.argv[2]
if (!base) {
  server = createServer((req, res) => {
    const p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "")
    const f = join(pub, p)
    if (!existsSync(f) || !extname(f)) { res.writeHead(404); return res.end() }
    res.writeHead(200, { "content-type": mime[extname(f)] ?? "application/octet-stream" })
    res.end(readFileSync(f))
  })
  await new Promise((r) => server.listen(0, r))
  base = `http://localhost:${server.address().port}`
}
base = base.replace(/\/$/, "")

let commit = "unknown"
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: here }).toString().trim()
  if (execSync("git status --porcelain", { cwd: here }).toString().trim()) commit += "+uncommitted"
} catch {}

const failures = []
const fail = (where, msg) => { failures.push(`${where}: ${msg}`); console.log(`  FAIL ${where}: ${msg}`) }

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {})

async function check(page, errs, where, shot) {
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.waitForTimeout(1500)
  const m = await page.evaluate(() => ({
    text: document.body.innerText.trim().length,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }))
  if (m.text < 100) fail(where, `body looks empty (${m.text} chars of text)`)
  if (m.overflow > 1) fail(where, `horizontal overflow ${m.overflow}px`)
  for (const e of errs.splice(0)) fail(where, e)
  await page.screenshot({ path: join(outDir, `${shot}.png`), fullPage: true })
  console.log(`  ok? ${where}: text=${m.text} overflow=${m.overflow}`)
}

function watch(page, errs) {
  page.on("pageerror", (e) => errs.push(`pageerror ${e.message}`))
  page.on("console", (m) => { if (m.type() === "error") errs.push(`console.error ${m.text()}`) })
  page.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url().replace(base, "")}`) })
}

console.log(`commit ${commit}  base ${base}`)
for (const [vn, vp] of viewports) {
  console.log(`\n== ${vn} ${vp.width}x${vp.height}: every page loads ==`)
  for (const f of pages) {
    const ctx = await browser.newContext({ viewport: vp })
    const page = await ctx.newPage()
    const errs = []
    watch(page, errs)
    await page.goto(`${base}/localcheck/${f}`)
    await check(page, errs, `${vn} ${f}`, `${vn}-${f.replace(".html", "")}`)
    await ctx.close()
  }
  console.log(`\n== ${vn}: click through from index.html ==`)
  for (const [file, label] of NAV.slice(1)) {
    const ctx = await browser.newContext({ viewport: vp })
    const page = await ctx.newPage()
    const errs = []
    watch(page, errs)
    await page.goto(`${base}/localcheck/index.html`)
    await page.waitForTimeout(1500)
    try {
      if (vp.width < 640) {
        await page.locator("button", { hasText: "Home & Court" }).first().click({ timeout: 5000 })
        await page.locator('nav[aria-label="LocalCheck pages"] a', { hasText: label }).first().click({ timeout: 5000 })
      } else {
        await page.locator('[role="tab"]', { hasText: label }).first().click({ timeout: 5000 })
      }
      await page.waitForURL(new RegExp(`${file.replace(".", "\\.")}$`), { timeout: 8000 })
    } catch (e) {
      fail(`${vn} click ${label}`, `could not reach ${file}: ${e.message.split("\n")[0]}`)
      await ctx.close()
      continue
    }
    await check(page, errs, `${vn} click index -> ${file}`, `${vn}-click-${file.replace(".html", "")}`)
    await ctx.close()
  }
}
await browser.close()
server?.close()
console.log(`\ncommit tested: ${commit}`)
if (failures.length) {
  console.log(`\nFAILED (${failures.length}):\n${failures.map((x) => " - " + x).join("\n")}`)
  process.exit(1)
}
console.log("\nALL PAGES PASSED. Screenshots in " + outDir)
