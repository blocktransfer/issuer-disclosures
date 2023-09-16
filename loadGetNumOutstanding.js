document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    event.target.textContent = "Loading..."
	const code = event.target.getAttribute("asset-code");
    getNumOutstanding(code);
  });
  
  function getNumOutstanding(code) {
    fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => {
        document.querySelector('[asset-code="${code}"]').textContent = data.outstanding;
      })
      .catch(error => {
        document.querySelector('[asset-code="${code}"]').textContent = "Failed to load";
      });
  }
});
