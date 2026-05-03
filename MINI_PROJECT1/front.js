function goToMainPage() {
  const frontPage = document.getElementById("frontPage");

  frontPage.classList.add("zoom-out");

  setTimeout(() => {
    window.location.href = "calculation.html";
  }, 800);
}

// PAGE TRANSITION EFFECT

window.addEventListener("load", () => {
    document.body.classList.add("show-page");
});

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        if (href && !href.startsWith("#")) {
            e.preventDefault();

            document.body.classList.remove("show-page");
            document.body.classList.add("hide-page");

            setTimeout(() => {
                window.location.href = href;
            }, 400);
        }
    });
});