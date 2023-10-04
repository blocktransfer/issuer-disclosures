const parent = "../index.html";
const CURR_PATH = window.location.href.split("/");
const DOC_TYPE = CURR_PATH[CURR_PATH.length - 2].toUpperCase();
const STATEMENT_CODES_DEF = {
  "PNL": "Profit, Loss, & Retained Earnings",
  "BAL": "Balance Sheets",
  "CONTENT": "Issuer Reports",
  "DEF": "Proxy Statements",
};
const LOOKING_FOR_TXT = STATEMENT_CODES_DEF[DOC_TYPE];

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
      if (header.textContent.includes(LOOKING_FOR_TXT)) {
        statements = header.nextElementSibling;
      }
    });
    if (statements) {
      const list = statements.querySelector("ul");
      if (list) {
        const statementLinks = Array.from(list.querySelectorAll("a[href]"))
          .map(a => a.getAttribute("href"));
        if (statementLinks.length > 1) {
          statementLinks.sort((a, b) => a.localeCompare(b));
        }
        if (statementLinks.length) {
          const mostRecentStatementLink = statementLinks[0];
          // Redirect to the most recent statement link.
          window.location.href = mostRecentStatementLink;
        } else {
          throw new Error("No statement links found.");
        }
      } else {
        throw new Error("No <ul> element found in statements.");
      }
    } else {
      throw new Error("No statements section found.");
    }
  })
  .catch(error => {
    // Redirect to the 404 page in case of an error, including if LOOKING_FOR_TXT is not defined.
    window.location.href = "https://www.blocktransfer.com/404";
  });
