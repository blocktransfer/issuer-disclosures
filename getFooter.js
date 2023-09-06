document.addEventListener("DOMContentLoaded", function() {
  let footerPath = "/footer.html";
  const pathSplit = window.location.pathname.split("/");
  if (pathSplit.length > 2) {
    footerPath = "../footer.html";
    document.querySelector("img[alt='logo']").src = "../logo-white.png";
  }
  fetch(footerPath)
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("beforeend", data);
    });
});
