const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const scoreData = JSON.parse(localStorage.getItem("quizScore"));

if (!currentUser || !scoreData) {
  window.location.href = "index.html";
}

document.getElementById("resultName").textContent = currentUser.name;
document.getElementById("scoreDisplay").textContent = scoreData.score;
document.getElementById("totalDisplay").textContent = scoreData.total;
document.getElementById("percentageDisplay").textContent = scoreData.percentage;

let rank = "F (Needs Improvement)";
if (scoreData.percentage >= 90) rank = "A+ (Excellent 🏆)";
else if (scoreData.percentage >= 80) rank = "B (Very Good 🌟)";
else if (scoreData.percentage >= 70) rank = "C (Good 👍)";
else if (scoreData.percentage >= 50) rank = "D (Pass 👌)";

const isPassed = scoreData.percentage >= 50;
const msgContainer = document.getElementById("passFailMessage");

msgContainer.innerHTML = `
  <div class="result-status-box ${isPassed ? 'result-status-success' : 'result-status-fail'} mb-3">
    <i class="bi ${isPassed ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} fs-5"></i>
    <span>${isPassed ? 'Passed Successfully!' : 'Keep Going — You Can Do It!'}</span>
  </div>
  <div class="fw-bold text-purple mb-2">Academic Grade: ${rank}</div>
`;

const history = JSON.parse(localStorage.getItem(`history_${currentUser.email}`)) || [];
const historyList = document.getElementById("historyList");

if (historyList) {
  historyList.innerHTML = history.map(h => `
    <li class="list-group-item list-group-item-dark d-flex justify-content-between align-items-center">
      <span>${h.date}</span>
      <span class="badge text-light" style="background-color: var(--neon-purple);">${h.score}/${h.total} (${h.percentage}%)</span>
    </li>
  `).join('');
}

document.getElementById("tryAgainBtn")?.addEventListener("click", () => {
  localStorage.removeItem("quizScore");
  window.location.href = "quiz.html";
});