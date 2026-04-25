function goToMainPage() {
  const frontPage = document.getElementById("frontPage");

  frontPage.classList.add("zoom-out");

  setTimeout(() => {
    window.location.href = "calculation.html";
  }, 800);
}
