const pathParts = window.location.href.split("/");
const statementType = pathParts[pathParts.length - 2].toUpperCase();
const parent = "../index.html";

function headerContainsText(header, text) {
  return header.innerText.includes(text);
}

fetch(parent)
  .then(response => response.text())
  .then(html => {
    const issuerInfo = document.createElement("div");
    issuerInfo.innerHTML = html;
    const headerElements = issuerInfo.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const headerTextMap = {
      "PNL": "Profit, Loss, & Retained Earnings",
      "BAL": "Balance Sheets",
      "CONTENT": "Issuer Reports",
      "DEF": "Proxy Statements",
    };
    let targetSection = null;
    headerElements.forEach(function(header) {
      const targetText = headerTextMap[statementType];
      if (targetText && header.textContent.includes(targetText)) {
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
        console.log("Got mostRecentLink:", statementLink)
        if (file) {
          console.log("Success": file;//window.location.href = file;
        }
      }
    }
    throw new Error();
  })
  .catch(console.log("failed"));//window.location.href = "https://www.blocktransfer.com/404");
