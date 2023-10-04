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
    const H3s = issuerInfo.querySelectorAll("h3");
    let targetSection = null;
    H3s.forEach(function(header) {
      if (LOOKING_FOR_TXT && header.textContent.includes(LOOKING_FOR_TXT)) {
        targetSection = header.nextElementSibling;
      }
    });
    const bulletList = targetSection.querySelector("ul");
    if (bulletList) {
      const pdfLinkArr = Array.from(bulletList.querySelectorAll("a"));
      console.log("pdfLinkArr:", pdfLinkArr);
      if (pdfLinkArr.length > 1) {
        pdfLinkArr.sort((a, b) => {
          const fileNameA = a.getAttribute("href").split("/").pop();
          const fileNameB = b.getAttribute("href").split("/").pop();
          return fileNameA.localeCompare(fileNameB);
        });
      }
      if (pdfLinkArr.length) {
        const mostRecentStatement = pdfLinkArr[0];
        const statementLink = mostRecentStatement.getAttribute("href");
        console.log("Most recent PDF link:", statementLink);
      }
      if (statementLink) {
        const file = statementLink.getAttribute("href").split("/")[parts.length - 1];
        console.log("Got mostRecentLink:", statementLink);
        if (file) {
          console.log("Success": file);//window.location.href = file;
        }
      }
    }
    throw new Error();
  })
  .catch(console.log("failed"));//window.location.href = "https://www.blocktransfer.com/404");
