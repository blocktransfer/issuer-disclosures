document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    const securityType = event.target.getAttribute("security-type");
    getNumOutstandingLink.textContent = "Loading..."
	getNumOutstanding(securityType);
  });

  function getNumOutstanding(securityType) {
    const code = "1984803" + securityType;
    fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => {
        if (securityType === "ORD") {
          document.getElementById("ORD_out").textContent = data.outstanding;
        } else if (securityType === "PFD") {
          document.getElementById("PFD_out").textContent = data.outstanding;
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
});
