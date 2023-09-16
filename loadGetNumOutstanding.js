document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
	const code = event.target.getAttribute("asset-code");
	setOutstanding(event, 1)
    getNumOutstanding(code, event);
  });
  
  function getNumOutstanding(code, event) {
	fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => setOutstanding(event, data.outstanding))
      .catch(setOutstanding(event, 0))
  }
  
  function setOutstanding(event, val) {
	event.target.textContent = val ? val : "Failed to load";
  }
});
