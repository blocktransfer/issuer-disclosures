const parent = "../index.html";
const CURR_PATH = window.location.href.split("/");
const DOC_TYPE = CURR_PATH[CURR_PATH.length - 2].toUpperCase();
const STATEMENT_CODES_DEF = {
  "PNL": "Profit, Loss, & Retained Earnings",
  "BAL": "Balance Sheets",
  "CONTENT": "Issuer Reports",
  "DEF": "Proxy Statements",
};
const DOC_DISPLAY_TYPE = STATEMENT_CODES_DEF[DOC_TYPE];

function headerContainsText(header, text) {
  return header.innerText.includes(text);
}

fetch(parent)
  .then(response => response.text())
  .then(html => {
    const issuerInfo = document.createElement("div");
    issuerInfo.innerHTML = html;
    let statements = null;
    const H3s = issuerInfo.querySelectorAll("h3");
    H3s.forEach(function (header) {
      if (header.textContent.includes(DOC_DISPLAY_TYPE)) {
        statements = header.nextElementSibling;
      }
    });
    if (DOC_DISPLAY_TYPE && statements) {
      const list = statements.querySelector("ul");
      if (list) {
        const statementLinks = Array.from(list.querySelectorAll("a[href]"))
          .map(a => a.getAttribute("href"));
        if (statementLinks.length > 1) {
          statementLinks.sort((a, b) => a.localeCompare(b));
        }
        if (statementLinks.length) {
          const mostRecentStatementLink = statementLinks[0];
          window.location.href = mostRecentStatementLink.split("/")[1];
        } else {
          throw new Error("links not found in ${DOC_TYPE} <ul> list.");
        }
      } else {
        throw new Error("no ${DOC_DISPLAY_TYPE} <ul> child.");
      }
    } else {
      throw new Error("no H3 content for type ${DOC_TYPE}.");
    }
  })
  .catch(error => {
    console.log("Error finding statement:" error)
    window.location.href = "https://www.blocktransfer.com/404?utm_source=issuersInfo404&utm_medium=error";
  });
