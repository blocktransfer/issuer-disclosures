const pathParts = window.location.href.split("/");
const statementType = pathParts[pathParts.length - 2].toUpperCase();
const parent = "../index.html";

function headerContainsText(header, text) {
  return header.innerText.includes(text);
}

fetch(parent)
  .then(response => response.text())
  .then(html => {
    const searchLocalEnv = document.createElement("div");
    searchLocalEnv.innerHTML = html;
    const headerElements = searchLocalEnv.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let targetSection = null;
    headerElements.forEach(function(header) {
      console.log("Found header:", header)
      
      const headerTextMap = {
        "PNL": "Profit, Loss, & Retained Earnings",
        "BAL": "Balance Sheets",
        "CONTENT": "Issuer Reports",
        "DEF": "Proxy Statements",
      };
      const targetText = headerTextMap[statementType];
      if (targetText && header.textContent.includes(targetText)) {
        console.log("Found desired item:", header);
        targetSection = header.nextElementSibling;
      }
    });
    console.log("Got targetSection:", targetSection)
    
    // Assuming 'targetSection' is the desired section element
    const ulElement = targetSection.querySelector('ul');
    if (ulElement) {
      const pdfLinkElement = ulElement.querySelector('a[href$=".pdf"]');
      if (pdfLinkElement) {
        const pdfLink = pdfLinkElement.getAttribute('href');
        console.log("Found PDF link:", pdfLink);
        // You can now use 'pdfLink' for further processing, like opening the PDF.
      } else {
        console.log("No PDF link found in the section.");
      }
    } else {
      console.log("No <ul> element found in the section.");
    }
  
  if (ulElement) {
    const pdfLinkElements = Array.from(ulElement.querySelectorAll('a[href$=".pdf"]'));
    
    if (pdfLinkElements.length > 0) {
      // Sort the PDF links based on their href attribute (file name)
      pdfLinkElements.sort((a, b) => {
        const fileNameA = a.getAttribute("href").split("/").pop(); // Get the file name
        const fileNameB = b.getAttribute("href").split("/").pop(); // Get the file name
        return fileNameA.localeCompare(fileNameB); // Sort alphabetically
      });
  
      const mostRecentPdfLink = pdfLinkElements[0];
      const pdfLink = mostRecentPdfLink.getAttribute('href');
      console.log("Most recent PDF link:", pdfLink);
      // You can now use 'pdfLink' for further processing, like opening the PDF.
    } else {
      console.log("No PDF links found in the section.");
    }
  } else {
    console.log("No <ul> element found in the section.");
  }
  
  console.log("FOUND: ", mostRecentPdfLink)
    
    
    
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
