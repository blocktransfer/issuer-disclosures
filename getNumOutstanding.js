document.addEventListener("DOMContentLoaded", function() {
  const elementsWithAssetCodeToReplaceWithOutstanding = document.querySelectorAll("[asset-code]");
  elementsWithAssetCodeToReplaceWithOutstanding.forEach(element => {
    const code = element.getAttribute("asset-code");
    // logic here for outstanding, float, otherInfo
    getNumOutstanding(code).then(outstanding => setOutstanding(element, outstanding, code));
  });

  function getNumOutstanding(code) {
    return fetch(`https://api.blocktransfer.com/assets/${code}/outstanding`)
      .then(response => (response.status === 200 ? response.text() : undefined))
      .then(assetInfo => JSON.parse(assetInfo))
  }

  function setOutstanding(element, outstanding, code) {
    astrix = "<span style='font-size: 0.8em; vertical-align: top;'>*</span>";
    element.innerHTML = `${formatNum(outstanding)} Shares Outstanding${astrix}`;
  }
  
  function formatNum(raw) {
    let [integerPart, decimalPart] = raw.split(".");
    integerPart = parseInt(integerPart).toLocaleString("en-US");
    const isDecimal = parseInt(decimalPart);
    return isDecimal ? `${integerPart}.${decimalPart.replace(/0+$/, "")}` : integerPart;
  }
});
