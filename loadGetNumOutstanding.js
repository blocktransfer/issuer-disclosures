document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("getNumOutstanding").addEventListener("click", function(event) {
    event.preventDefault();
    let target = event.target
	setOutstanding(target, "Loading...")
	const code = event.target.getAttribute("asset-code");
    getNumOutstanding(code, target);
  });
  
  function getNumOutstanding(code, target) {
	fetch("https://api.blocktransfer.com/getNumOutstanding/" + code)
      .then(response => response.json())
      .then(data => {
        setOutstanding(target, data.outstanding);
      })
      .catch(error => {
        console.error(error);
        setOutstanding(target, "Failed to load");
      });
  }
  
  function setOutstanding(target, val) {
	target.textContent = val
  }
});
