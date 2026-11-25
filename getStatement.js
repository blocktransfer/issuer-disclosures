const current = new URL(window.location.href);
const pathParts = current.pathname.split("/").filter(Boolean);
if (pathParts[pathParts.length - 1] === "index.html") pathParts.pop();
const DOC_TYPE = (pathParts.pop() || "").toUpperCase();
const parent = new URL("/" + pathParts.join("/") + "/index.html", current);
const STATEMENT_CODES_DEF = {
  "BAL": "Balance Sheet",
  "DEF": "Proxy Statements",
  "DOC": "Issuer Reports",
  "PNL": "Profit, Loss, & Retained Earnings",
};
const DOC_DISPLAY_TYPE = STATEMENT_CODES_DEF[DOC_TYPE];

function statementDate(href) {
  const match = /^([a-z]+)\/(\d{4})-(\d{1,2})-(\d{1,2})_[^/]+\.pdf$/i.exec(href);
  if (!match || match[1].toUpperCase() !== DOC_TYPE) return null;
  const [year, month, day] = match.slice(2).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date.getTime();
}

fetch(parent.href)
  .then(response => {
    if (!response.ok) throw new Error(`Issuer page returned ${response.status}.`);
    return response.text();
  })
  .then(html => {
    const issuerInfo = document.createElement("div");
    issuerInfo.innerHTML = html;
    const header = Array.from(issuerInfo.querySelectorAll("h3"))
      .find(header => DOC_DISPLAY_TYPE && header.textContent.includes(DOC_DISPLAY_TYPE));
    const statements = header && header.nextElementSibling;
    if (!statements) throw new Error(`H3 content for type ${DOC_TYPE}.`);

    let latest = null;
    let latestDate = -Infinity;
    for (const link of statements.querySelectorAll("ul a[href]")) {
      const href = link.getAttribute("href");
      const date = statementDate(href);
      if (date !== null && date > latestDate) {
        latest = href;
        latestDate = date;
      }
    }
    if (!latest) throw new Error(`No dated PDF links for ${DOC_TYPE}.`);
    window.location.href = new URL(latest, parent).href;
  })
  .catch(error => {
    console.log("Error finding statement:", error.message);
    window.location.href = "https://www.blocktransfer.com/404?utm_source=issuersInfo404&utm_medium=error";
  });
