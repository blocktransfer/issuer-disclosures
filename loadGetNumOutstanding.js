document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    event.target.textContent = "Loading..."
	const code = event.target.getAttribute("asset-code");
    getNumOutstanding(code);
  });
  
  function getNumOutstanding(code) {
    let target = document.querySelector(`[asset-code="${code}"]`).textContent;
	fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => {
        target = data.outstanding;
      })
      .catch(error => {
        console.error(error);
        target = "Failed to load";
      });
  }
});
