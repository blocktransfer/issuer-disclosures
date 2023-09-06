document.addEventListener("DOMContentLoaded", function() {
  let footerPath = "/footer.html";
  const pathSplit = window.location.pathname.split("/");
  if (pathSplit.length > 2) {
    footerPath = "../footer.html";
  }
  fetch(footerPath)
    .then(response => {
      if (!response.ok) {
        console.log("Fetch failed:", response.status, response.statusText);
        return null;
      }
      return response.text();
    })
    .then(data => {
      if (data) {
        document.body.insertAdjacentHTML("beforeend", data);
      }
    })
    .catch(error => {
      console.log("Fetch error:", error);
    });
});
