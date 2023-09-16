document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
	const code = event.target.getAttribute("asset-code");
	setOutstanding(event, "Loading...")
    getNumOutstanding(code, event);
  });
  
  function getNumOutstanding(code, event) {
	fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => setOutstanding(event, data.outstanding))
      .catch(error => {
        console.log(error)
		setOutstanding(event, "Failed to load");
      });
  }
  
  function setOutstanding(event, val) {
	console.log(event)
	event.target.textContent = val
  }
});
