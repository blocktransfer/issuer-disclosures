document.addEventListener("DOMContentLoaded", function() {
  const elementsWithAssetCode = document.querySelectorAll("[asset-code]");

  elementsWithAssetCode.forEach(element => {
    const code = element.getAttribute("asset-code");
    setNumOutstanding(code, element);
  });

  function setNumOutstanding(code, element) {
    fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => setField(element, data.outstanding))
      .catch(() => setField(element, "Failed to load"));
  }

  function setField(element, val) {
    const currentDate = new Date().toLocaleDateString();
    element.textContent = `${currentDate} - ${val}`;
  }
});