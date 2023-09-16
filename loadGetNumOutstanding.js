document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    const securityType = event.target.getAttribute("security-code");
    event.target.textContent = "Loading..."
	getNumOutstanding(securityType);
  });
  
  function getNumOutstanding(code) {
    fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => {
        updateOutstandingField(securityType, data.outstanding);
      })
      .catch(error => {
        console.error("Error:", error);
        updateOutstandingField(securityType, "Error");
      });
  }

  function updateOutstandingField(securityType, num) {
    if (securityType === "ORD") {
      document.getElementById("ORD_out").textContent = num;
    } else if (securityType === "PFD") {
      document.getElementById("PFD_out").textContent = num;
    } else if (securityType === "Error") {
	  document.getElementById("ORD_out").textContent = "90000000"; //TEMP
	}
  }
});
