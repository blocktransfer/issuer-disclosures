document.addEventListener("DOMContentLoaded", function() {
  let footerPath = "/footer.html";
  let logoPath = "logo-white.png";
  const pathSplit = window.location.pathname.split("/");
  if (pathSplit.length > 2) {
    footerPath = "../footer.html";
    logoPath = "../logo-white.png";
  }
  fetch(footerPath)
    .then(response => {
      if (!response.ok) {
        console.log("Fetch failed:", response.status, response.statusText);
        return null;
      }
      return response.text();
    })
    
    .catch(error => {
      console.log("Fetch error:", error);
    });
});
