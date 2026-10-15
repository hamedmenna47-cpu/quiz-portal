const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "index.html";
document.getElementById("studentNameDisplay").textContent = currentUser.name;

let quizQuestions = [], currentQuestionIndex = 0, score = 0, userAnswers = {}, timeLeft = 900, timerInterval;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function initQuiz() {
  try {
    const savedState = JSON.parse(localStorage.getItem("quizState"));
    const res = await fetch("data/questions.json");
    const data = await res.json();
    
    if (savedState && savedState.email === currentUser.email) {
      quizQuestions = savedState.quizQuestions;
      currentQuestionIndex = savedState.currentQuestionIndex;
      score = savedState.score;
      userAnswers = savedState.userAnswers || {};
      timeLeft = savedState.timeLeft;
    } else {
      quizQuestions = shuffle(data).slice(0, 10);
    }
    
    startTimer();
    showQuestion();
  } catch (e) {
    document.getElementById("quizError").textContent = "Error loading questions.";
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
      return;
    }
    timeLeft--;
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById("timerDisplay").innerHTML = `<i class="bi bi-clock me-1"></i>${m}:${s < 10 ? '0' : ''}${s}`;
  }, 1000);
}

function saveState() {
  localStorage.setItem("quizState", JSON.stringify({ email: currentUser.email, quizQuestions, currentQuestionIndex, score, userAnswers, timeLeft }));
}

function showQuestion() {
  document.getElementById("quizError").textContent = "";
  if (currentQuestionIndex >= quizQuestions.length) return finishQuiz();

  const q = quizQuestions[currentQuestionIndex];
  document.getElementById("currentQNum").textContent = currentQuestionIndex + 1;
  document.getElementById("totalQNum").textContent = quizQuestions.length;
  document.getElementById("progressBar").style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;

  // إظهار أو إخفاء زرار السابق
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (currentQuestionIndex > 0) {
    prevBtn.classList.remove("d-none");
    nextBtn.classList.remove("w-100");
    nextBtn.classList.add("w-50");
  } else {
    prevBtn.classList.add("d-none");
    nextBtn.classList.remove("w-50");
    nextBtn.classList.add("w-100");
  }

  const container = document.getElementById("questionContainer");
  container.innerHTML = `<h5 class="mb-3 text-white"></h5><div class="d-flex flex-column" id="choicesList"></div>`;
  container.querySelector("h5").textContent = q.question;

  const choicesList = document.getElementById("choicesList");
  q.choices.forEach((choiceText, index) => {
    const btn = document.createElement("button");
    btn.className = `btn choice-btn mb-2 py-2 text-white ${userAnswers[currentQuestionIndex] === index ? 'active-choice' : ''}`;
    btn.textContent = choiceText; // عرض النص بأمان تام دون أخطاء HTML
    btn.onclick = () => selectChoice(index);
    choicesList.appendChild(btn);
  });

  saveState();
}

window.selectChoice = function(i) {
  userAnswers[currentQuestionIndex] = i;
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach((btn, idx) => {
    btn.className = `btn choice-btn mb-2 py-2 text-white ${idx === i ? 'active-choice' : ''}`;
  });
};

document.getElementById("nextBtn").addEventListener("click", () => {
  if (userAnswers[currentQuestionIndex] === undefined) {
    document.getElementById("quizError").textContent = "Please select an answer!";
    return;
  }
  currentQuestionIndex++;
  showQuestion();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});

function finishQuiz() {
  clearInterval(timerInterval);
  localStorage.removeItem("quizState");

  // حساب الدرجة النهائية بناءً على الإجابات المخزنة
  score = 0;
  quizQuestions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswer) score++;
  });

  const resultData = { score, total: quizQuestions.length, percentage: Math.round((score / quizQuestions.length) * 100), date: new Date().toLocaleString() };
  
  let history = JSON.parse(localStorage.getItem(`history_${currentUser.email}`)) || [];
  history.push(resultData);
  localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(history));
  localStorage.setItem("quizScore", JSON.stringify(resultData));
  window.location.href = "result.html";
}

initQuiz();