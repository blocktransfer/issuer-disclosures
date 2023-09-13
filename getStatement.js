function redirectToMostRecentStatement() {
  const pathParts = window.location.href.split("/");
  const statementType = pathParts[pathParts.length - 2].toUpperCase();
  console.log(statementType);
  const parent = "../index.html";
  fetch(parent)
    .then(response => response.text())
    .then(html => {
      const searchDiv = document.createElement("div");
      searchDiv.innerHTML = html;
      const headerElements = searchDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
      let targetSection = null;
      headerElements.forEach(function (header) {
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
      if (targetSection) {
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
          const mostRecentLink = sortedLinks[0];
          if (mostRecentLink) {
            const pdfLink = mostRecentLink.getAttribute("href");
            const parts = pdfLink.split("/");
            const name = parts[parts.length - 1];
            if (name) {
              window.location.href = name;
            }
          }
        } else {
          window.location.href = "https://www.blocktransfer.com/404";
        }
      } else {
        window.location.href = "https://www.blocktransfer.com/404";
      }
    })
    .catch(error => {
      window.location.href = "https://www.blocktransfer.com/404";
    });
}