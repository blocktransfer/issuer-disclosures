function getCIK() {
  const pathParts = window.location.href.split("/");
  const statementType = pathParts[pathParts.length - 2].toUpperCase();
  console.log(statementType);
}