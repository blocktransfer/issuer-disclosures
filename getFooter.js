document.addEventListener("DOMContentLoaded", function() {
  let footerPath = "/footer.html";
  if (window.location.pathname.split("/").length > 2) {
    footerPath = "../footer.html";
  }
  fetch(footerPath)
    .then(response => response.text())
    .then(data => document.body.insertAdjacentHTML("afterend", data))
    .catch(error => console.log("Fetch error:", error))
});