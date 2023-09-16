document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    let target = event.target.textContent
	target = "Loading..."
	const code = event.target.getAttribute("asset-code");
    getNumOutstanding(code, target);
  });
  
  function getNumOutstanding(code, target) {
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
