document.addEventListener("DOMContentLoaded", function() {
  const elementsWithAssetCodeToReplaceWithOutstanding = document.querySelectorAll("[asset-code]");
  elementsWithAssetCodeToReplaceWithOutstanding.forEach(element => {
    const code = element.getAttribute("asset-code");
    setNumOutstanding(code, element);
  });

  function setNumOutstanding(code, element) {
    fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => setField(element, data))
      .catch(() => setField(element, 0));
  }

  function setField(element, val) {
	if (val) {
      let [integerPart, decimalPart] = val.split(".");
      integerPart = parseInt(integerPart).toLocaleString("en-US");
      const isDecimal = parseInt(decimalPart);
      const formattedVal = isDecimal ? `${integerPart}.${decimalPart}` : integerPart;
      const currentDate = new Date().toLocaleDateString("en-US", {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      element.textContent = `${formattedVal} Shares Outstanding on ${currentDate}`;
    }
  }
});