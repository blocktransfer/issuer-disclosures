const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const test = require("node:test");
const script = readFileSync(path.join(__dirname, "../../getStatement.js"), "utf8");

async function navigate(route, links, ok = true) {
  const location = { href: `https://issuers.info/1846058/${route}` };
  const selectors = [];
  await vm.runInNewContext(script, {
    URL, window: { location }, console: { log() {} },
    document: { createElement: () => ({
      querySelectorAll(selector) {
        selectors.push(selector);
        return links.map(href => ({ getAttribute: () => href }));
      },
    }) },
    fetch: async url => {
      assert.equal(url, "https://issuers.info/1846058/index.html");
      return { ok, status: ok ? 200 : 404, text: async () => "" };
    },
  });
  assert.ok(selectors.every(selector => selector === "a[href]"));
  return location.href;
}

test("selects latest statement across all page links without headings", async () => {
  assert.equal(await navigate("PNL/", [
    "PNL/2024-12-31_Annual.pdf", "BAL/2026-12-31_Annual.pdf", "PNL/2025-12-31_Annual.pdf",
  ]), "https://issuers.info/1846058/PNL/2025-12-31_Annual.pdf");
});

test("compares unpadded dates numerically and supports lowercase paths", async () => {
  assert.equal(await navigate("pnl/index.html?ref=test", [
    "pnl/2025-9-30_quarterly.pdf", "pnl/2025-12-31_annual.pdf", "pnl/2025-2-8_quarterly.pdf",
    "pnl/2025-12-8_quarterly.pdf",
  ]), "https://issuers.info/1846058/pnl/2025-12-31_annual.pdf");
});

test("supports balance sheets and slashless routes without headings", async () => {
  assert.equal(await navigate("BAL", ["BAL/2025-12-31_Annual.pdf"]),
    "https://issuers.info/1846058/BAL/2025-12-31_Annual.pdf");
});

test("selects issuer reports and proxy statements independently of headings", async () => {
  const links = ["DOC/2024-2-23_Deck.pdf", "DOC/2023-10-18_Revocation.pdf", "DEF/2025-1-1_Proxy.pdf"];
  assert.equal(await navigate("DOC/", links), "https://issuers.info/1846058/DOC/2024-2-23_Deck.pdf");
  assert.equal(await navigate("DEF/", links), "https://issuers.info/1846058/DEF/2025-1-1_Proxy.pdf");
});

test("ignores unrelated, malformed, and impossible dates", async () => {
  assert.equal(await navigate("pnl/", [
    "doc/2029-12-31_annual.pdf", "pnl/2026-2-30_annual.pdf", "pnl/undated.pdf", "pnl/2025-1-1_annual.pdf",
  ]), "https://issuers.info/1846058/pnl/2025-1-1_annual.pdf");
});

test("preserves fallback for empty statements, unknown types, or failed issuer requests", async () => {
  const fallback = "https://www.blocktransfer.com/404?utm_source=issuersInfo404&utm_medium=error";
  assert.equal(await navigate("BAL/", []), fallback);
  assert.equal(await navigate("BAL/", ["BAL/2025-12-31_Annual.pdf"], false), fallback);
  assert.equal(await navigate("OTHER/", ["OTHER/2025-12-31_Annual.pdf"]), fallback);
});
