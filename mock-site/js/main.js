// StreamMax Pro — Mock site interactivity
document.addEventListener("DOMContentLoaded", () => {

  // --- Login form: navigate to dashboard on submit ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "dashboard.html";
    });
  }

  // --- Cancel Reason: enable Next button only when a reason is selected ---
  const reasonSelect = document.getElementById("cancel-reason");
  const reasonNextBtn = document.getElementById("reason-next-btn");
  if (reasonSelect && reasonNextBtn) {
    reasonSelect.addEventListener("change", () => {
      reasonNextBtn.disabled = !reasonSelect.value;
    });
  }

  // --- Retention Offer: fake countdown timer ---
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    let totalSeconds = 4 * 60 + 59; // 4:59

    const tick = () => {
      if (totalSeconds <= 0) {
        countdownEl.textContent = "0:00";
        return;
      }
      totalSeconds--;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      countdownEl.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    };

    setInterval(tick, 1000);
  }

});
