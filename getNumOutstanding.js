document.addEventListener("DOMContentLoaded", function() {
  const elementsWithAssetCodeToReplaceWithOutstanding = document.querySelectorAll("[asset-code]");
  elementsWithAssetCodeToReplaceWithOutstanding.forEach(element => {
    const code = element.getAttribute("asset-code");
    console.log(getNumOutstanding(code))
    getNumOutstanding(code).then(outstanding => setFields(element, outstanding, code));
  });

  function getNumOutstanding(code) {
    return fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => {
        if (response.status === 200) {
          return response.text();
        }
      });
  }

  function setFields(element, data, code) {
    let [integerPart, decimalPart] = data.split(".");
    integerPart = parseInt(integerPart).toLocaleString("en-US");
    const isDecimal = parseInt(decimalPart);
    const formattedVal = isDecimal ? `${integerPart}.${decimalPart}` : integerPart;
    element.innerHTML = `${formattedVal} Shares Outstanding<span style="font-size: .8em">*</span>`;
    const currDatePlaceholder = document.createElement("span");
    const currDate = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    currDatePlaceholder.textContent = `<span style="font-size: .8em">*As of ${currDate}</span>`;
    const dateDisclaimerElement = document.getElementById(`dateDisclaimer${code}`);
    dateDisclaimerElement.appendChild(currentDatePlaceholder);
  }
});
