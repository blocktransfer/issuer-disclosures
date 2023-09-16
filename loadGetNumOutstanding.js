document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    const securityType = event.target.getAttribute("asset-code");
    event.target.textContent = "Loading..."
	getNumOutstanding(securityType);
  });
  
  function getNumOutstanding(code) {
    fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => {
        document.querySelector('[asset-code="${code}"]').textContent = data.outstanding;
      })
      .catch(error => {
        console.error("Error:", error);
        document.querySelector('[asset-code="${code}"]').textContent = "Failed to load";
      });
  }
});
