document.addEventListener("DOMContentLoaded", function() {
  const elementsWithAssetCodeToReplaceWithOutstanding = document.querySelectorAll("[asset-code]");
  elementsWithAssetCodeToReplaceWithOutstanding.forEach(element => {
    const code = element.getAttribute("asset-code");
    getNumOutstanding(code).then(outstanding => setFields(element, outstanding, code));
  });

  function getNumOutstanding(code) {
    return fetch(`https://api.blocktransfer.com/assets/${code}`)
      .then(response => (response.status === 200 ? response.text() : undefined))
      .then(assetInfo => {
        console.log(assetInfo);
        return assetInfo.text();
      })
  }

  function setFields(element, outstandingRaw, code) {
    astrix = "<span style='font-size: 0.8em; vertical-align: top;'>*</span>";
    let [integerPart, decimalPart] = outstandingRaw.split(".");
    integerPart = parseInt(integerPart).toLocaleString("en-US");
    const isDecimal = parseInt(decimalPart);
    const outstanding = isDecimal ? `${integerPart}.${decimalPart.replace(/0+$/, "")}` : integerPart;
    const currDateTime = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const dateDisclaimer = document.createElement("span");
    dateDisclaimer.innerHTML = `
      <p style="margin-top: -5px; text-indent: 0;">
        <span class="small-symbol">*</span>
        <span class="small-text">As of ${currDateTime}.</span>
      </p>
    `;
    const disclaimerPageElement = document.getElementById(`dateDisclaimer${code}`);
    disclaimerPageElement.appendChild(dateDisclaimer);
    element.innerHTML = `${outstanding} Shares Outstanding${astrix}`;
  }
});
