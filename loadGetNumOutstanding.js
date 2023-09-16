document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("load", function(event) {
    event.preventDefault();
	const code = event.target.getAttribute("asset-code");
    setNumOutstanding(code, event);
  });
  
  function setNumOutstanding(code, event) {
	fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => setField(event, data.outstanding))
      .catch(setField(event, 0))
  }
  
  function setField(event, val) {
	event.target.textContent = val ? val : "Failed to load";
  }
});
