document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    const securityType = event.target.getAttribute("data-code");
    event.target.textContent = "Loading..."
	getNumOutstanding(securityType);
  });
  
  function getNumOutstanding(code) {
    fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => {
        updateOutstandingField(code, data.outstanding);
      })
      .catch(error => {
        console.error("Error:", error);
        updateOutstandingField(code, 0);
      });
  }

  function updateOutstandingField(securityType, num) {
    if (num) {
      document.getElementById(code).textContent = num;
    } else {
	  document.getElementById(code).textContent = "Failed to load";
	}
  }
});
