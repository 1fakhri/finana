// StreamMax Pro - Mock site interactivity
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "dashboard.html";
    });
  }
});
