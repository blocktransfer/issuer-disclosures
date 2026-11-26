const current = new URL(window.location.href);
const pathParts = current.pathname.split("/").filter(Boolean);
if (pathParts[pathParts.length - 1] === "index.html") pathParts.pop();
const DOC_TYPE = (pathParts.pop() || "").toUpperCase();
const parent = new URL("/" + pathParts.join("/") + "/index.html", current);
const STATEMENT_CODES = ["BAL", "DEF", "DOC", "PNL"];

function statementDate(href) {
  const match = /^([a-z]+)\/(\d{4})-(\d{1,2})-(\d{1,2})_[^/]+\.pdf$/i.exec(href);
  if (!match || match[1].toUpperCase() !== DOC_TYPE) return null;
  const [year, month, day] = match.slice(2).map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) return null;

  // Compare calendar dates numerically without padding or time zones.
  return year * 10000 + month * 100 + day;
}

fetch(parent.href)
  .then(response => {
    if (!response.ok) throw new Error(`Issuer page returned ${response.status}.`);
    return response.text();
  })
  .then(html => {
    if (!STATEMENT_CODES.includes(DOC_TYPE)) throw new Error(`Unknown statement type ${DOC_TYPE}.`);
    const issuerInfo = document.createElement("div");
    issuerInfo.innerHTML = html;
    let latest = null;
    let latestDate = 0;
    for (const link of issuerInfo.querySelectorAll("a[href]")) {
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
