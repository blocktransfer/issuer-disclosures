const pathParts = window.location.href.split("/");
const statementType = pathParts[pathParts.length - 2].toUpperCase();
const parent = "index.html";
fetch(parent)
  .then(response => response.text())
  .then(html => {
    const searchLocalEnv = document.createElement("div");
    searchLocalEnv.innerHTML = html;
    const headerElements = searchLocalEnv.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let targetSection = null;
    console.log("Got statementType:", statementType)
    console.log("Got innerHTML:", html)
    headerElements.forEach(function(header) {
      console.log("Found header:", header)
      if (statementType === "PNL" && $(header).text().includes("Profit, Loss, & Retained Earnings")) {
        targetSection = header.nextElementSibling;
      } else if (statementType === "BAL" && $(header).text().includes("Balance Sheets")) {
        targetSection = header.nextElementSibling;
      } else if (statementType === "CONTENT" && $(header).text().includes("Issuer Reports")) {
        targetSection = header.nextElementSibling;
      } else if (statementType === "DEF" && $(header).text().includes("Proxy Statements")) {
        targetSection = header.nextElementSibling;
      }
    });
    console.log("Got targetSection:", targetSection)
    const pdfLinks = targetSection.querySelectorAll('a[href$=".pdf"]');
    if (pdfLinks.length) {
      const sortedLinks = Array.from(pdfLinks).sort((a, b) => {
        const getDateFromLink = (link) => {
          const datePart = link.textContent.match(/\d{4}-\d{1,2}-\d{1,2}/);
          return datePart ? new Date(datePart[0]) : null;
        };
        const dateA = getDateFromLink(a);
        const dateB = getDateFromLink(b);
        return dateB - dateA;
      });
      console.log("Got sortedLinks:", sortedLinks)
      const mostRecentLink = sortedLinks[0];
      if (mostRecentLink) {
        const file = mostRecentLink.getAttribute("href").split("/")[parts.length - 1];
        console.log("Got mostRecentLink:", mostRecentLink)
        if (file) {
          window.location.href = file;
        }
      }
    } else {
      console.log("failed")
      // window.location.href = "https://www.blocktransfer.com/404";
    }
  })
  .catch(console.log("no parent"));//window.location.href = "https://www.blocktransfer.com/404");
