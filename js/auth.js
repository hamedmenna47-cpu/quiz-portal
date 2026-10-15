function showAlert(id, msg, type = "danger") {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} py-2`;
  el.textContent = msg;
  el.classList.remove("d-none");
}

function setupToggle(inputId, btnId, iconId) {
  const input = document.getElementById(inputId),
    btn = document.getElementById(btnId),
    icon = document.getElementById(iconId);
  if (input && btn && icon) {
    btn.addEventListener("click", () => {
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      icon.className = isPass ? "bi bi-eye" : "bi bi-eye-slash";
    });
  }
}

setupToggle("password", "togglePassword", "toggleIcon1");
setupToggle("confirmPassword", "toggleConfirmPassword", "toggleIcon2");
setupToggle("loginPassword", "toggleLoginPassword", "toggleLoginIcon");

const emailInput = document.getElementById("email");
const suggestBox = document.getElementById("emailSuggestBox");
const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];

function updateEmailSuggestions() {
  if (!emailInput || !suggestBox) return;

  const rawVal = emailInput.value.trim().toLowerCase();
  suggestBox.innerHTML = "";

  if (!rawVal) {
    suggestBox.classList.add("d-none");
    return;
  }

  if (rawVal.includes("@")) {
    const parts = rawVal.split("@");
    const namePart = parts[0];
    const domainFilter = parts[1] || "";

    const filteredDomains = domains.filter((d) => d.startsWith(domainFilter));
    if (filteredDomains.length === 0) {
      suggestBox.classList.add("d-none");
      return;
    }

    filteredDomains.forEach((domain) => {
      const fullEmail = `${namePart}@${domain}`;
      const item = document.createElement("div");
      item.className = "suggest-item";
      item.innerHTML = `<i class="bi bi-envelope-at me-2 text-purple"></i>${fullEmail}`;

      item.addEventListener("click", () => {
        emailInput.value = fullEmail;
        suggestBox.classList.add("d-none");
      });

      suggestBox.appendChild(item);
    });
  } else {
    const rand1 = Math.floor(Math.random() * 90) + 10;
    const rand2 = Math.floor(Math.random() * 900) + 100;
    const currentYear = new Date().getFullYear();

    const randomNames = [
      rawVal,
      `${rawVal}${rand1}`,
      `${rawVal}${rand2}`,
      `${rawVal}_${currentYear}`,
    ];

    randomNames.forEach((suggestion) => {
      const item = document.createElement("div");
      item.className = "suggest-item";
      item.innerHTML = `<i class="bi bi-person-badge me-2 text-purple"></i>${suggestion} <span class="text-secondary small">(Select Domain)</span>`;

      item.addEventListener("click", () => {
        emailInput.value = `${suggestion}@`;
        updateEmailSuggestions();
      });

      suggestBox.appendChild(item);
    });
  }

  suggestBox.classList.remove("d-none");
}

if (emailInput && suggestBox) {
  emailInput.addEventListener("input", updateEmailSuggestions);
  emailInput.addEventListener("focus", updateEmailSuggestions);

  document.addEventListener("click", (e) => {
    if (!emailInput.contains(e.target) && !suggestBox.contains(e.target)) {
      suggestBox.classList.add("d-none");
    }
  });
}

const passInput = document.getElementById("password"),
  confirmInput = document.getElementById("confirmPassword"),
  strengthBar = document.getElementById("passwordStrengthBar"),
  matchMsg = document.getElementById("matchMessage");

if (passInput && strengthBar) {
  passInput.addEventListener("input", () => {
    let score = 0,
      val = passInput.value;
    if (val.length >= 8) score += 25;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score += 25;
    if (/\d/.test(val)) score += 25;
    if (/[^a-zA-Z0-9]/.test(val)) score += 25;
    strengthBar.style.width = score + "%";
    strengthBar.className = `progress-bar bg-${
      score <= 25
        ? "danger"
        : score <= 50
        ? "warning"
        : score <= 75
        ? "info"
        : "success"
    }`;
    checkMatch();
  });
}

if (confirmInput) confirmInput.addEventListener("input", checkMatch);

function checkMatch() {
  if (!confirmInput || !passInput || !matchMsg || !confirmInput.value) return;
  matchMsg.textContent =
    passInput.value === confirmInput.value
      ? "Passwords match!"
      : "Passwords do not match!";
  matchMsg.className = `small text-${
    passInput.value === confirmInput.value ? "success" : "danger"
  }`;
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!document.getElementById("termsCheck").checked)
      return showAlert("registerAlert", "Accept terms.");
    if (password !== confirmPassword)
      return showAlert("registerAlert", "Passwords do not match.");

    let students = JSON.parse(localStorage.getItem("students")) || [];
    if (students.some((s) => s.email === email))
      return showAlert("registerAlert", "Email already registered.");

    students.push({ id: Date.now().toString(), name, email, password });
    localStorage.setItem("students", JSON.stringify(students));
    showAlert(
      "registerAlert",
      "Registered successfully! Redirecting...",
      "success"
    );
    setTimeout(() => (window.location.href = "index.html"), 1000);
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    let students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students.find(
      (s) => s.email === email && s.password === password
    );
    if (!student) return showAlert("loginAlert", "Invalid credentials.");
    localStorage.setItem("currentUser", JSON.stringify(student));
    window.location.href = "quiz.html";
  });

  document
    .getElementById("forgotPasswordLink")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const students = JSON.parse(localStorage.getItem("students")) || [];
      const user = students.find((s) => s.email === email);
      showAlert(
        "loginAlert",
        user ? `Password: ${user.password}` : "Email not found.",
        user ? "info" : "danger"
      );
    });
}

function handleLogout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("quizScore");
  localStorage.removeItem("quizState");
  window.location.href = "index.html";
}