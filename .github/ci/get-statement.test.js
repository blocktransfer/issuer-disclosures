const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const test = require("node:test");
const script = readFileSync(path.join(__dirname, "../../getStatement.js"), "utf8");

async function navigate(route, heading, lists, ok = true) {
  const location = { href: `https://issuers.info/1846058/${route}` };
  const headers = [{ textContent: heading, nextElementSibling: {
    querySelectorAll(selector) {
      assert.equal(selector, "ul a[href]");
      return lists.flat().map(href => ({ getAttribute: () => href }));
    },
  } }];
  await vm.runInNewContext(script, {
    URL, window: { location }, console: { log() {} },
    document: { createElement: () => ({ querySelectorAll: () => headers }) },
    fetch: async url => {
      assert.equal(url, "https://issuers.info/1846058/index.html");
      return { ok, status: ok ? 200 : 404, text: async () => "" };
    },
  });
  return location.href;
}

test("selects latest statement across separate annual lists", async () => {
  assert.equal(await navigate("PNL/", "Profit, Loss, & Retained Earnings", [
    ["PNL/2024-12-31_Annual.pdf"], ["PNL/2025-12-31_Annual.pdf"],
  ]), "https://issuers.info/1846058/PNL/2025-12-31_Annual.pdf");
});

test("compares unpadded dates numerically and supports lowercase paths", async () => {
  assert.equal(await navigate("pnl/index.html?ref=test", "Profit, Loss, & Retained Earnings", [
    ["pnl/2025-9-30_quarterly.pdf", "pnl/2025-12-31_annual.pdf", "pnl/2025-2-8_quarterly.pdf"],
    ["pnl/2025-12-8_quarterly.pdf"],
  ]), "https://issuers.info/1846058/pnl/2025-12-31_annual.pdf");
});

test("recognizes singular balance sheet heading and slashless route", async () => {
  assert.equal(await navigate("BAL", "Balance Sheet", [["BAL/2025-12-31_Annual.pdf"]]),
    "https://issuers.info/1846058/BAL/2025-12-31_Annual.pdf");
});

test("ignores unrelated, malformed, and impossible dates", async () => {
  assert.equal(await navigate("pnl/", "Profit, Loss, & Retained Earnings", [[
    "doc/2029-12-31_annual.pdf", "pnl/2026-2-30_annual.pdf", "pnl/undated.pdf", "pnl/2025-1-1_annual.pdf",
  ]]), "https://issuers.info/1846058/pnl/2025-1-1_annual.pdf");
});

test("preserves fallback for empty statements or failed issuer requests", async () => {
  const fallback = "https://www.blocktransfer.com/404?utm_source=issuersInfo404&utm_medium=error";
  assert.equal(await navigate("BAL/", "Balance Sheet", []), fallback);
  assert.equal(await navigate("BAL/", "Balance Sheet", [["BAL/2025-12-31_Annual.pdf"]], false), fallback);
});
