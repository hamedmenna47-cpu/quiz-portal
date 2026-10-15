# ⚡ Interactive Student Quiz Portal

A high-end, responsive Web Application featuring a modern **Dark Cyberpunk Neon** aesthetic with dynamic state persistence, dynamic user onboarding, and an automated quiz scoring system.

---

## ✨ Features & Key Highlights

- **🎨 Modern Cyberpunk UI/UX:** Built with custom CSS Glassmorphism, deep navy background gradients, subtle glowing purple borders, and responsive design.
- **🔐 Dynamic Authentication System:**
  - Login & Registration with real-time field validation.
  - **Smart Account Generator:** Dynamically generates randomized username variations and seamless multi-step domain dropdown menus (`@gmail.com`, `@yahoo.com`, etc.).
  - Password strength indicator and password toggle visibility.
- **⏱️ Interactive Quiz Engine:**
  - Dynamic 10-question random sampling from JSON dataset.
  - Integrated 15-minute countdown timer with auto-submit on expiration.
  - Full navigation support with styled **Next** and **Previous** glassmorphism buttons.
  - State persistence via `LocalStorage` (resumes quiz session on page refresh).
- **📊 Advanced Results & History:**
  - Dynamic grade calculation (A+, B, C, D, F).
  - Elegant success/failure feedback boxes with custom iconography and subtle status glows.
  - Historical test tracking saved per student account.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Bootstrap Icons
- **Design Concepts:** Glassmorphism, CSS Custom Variables, Glow Effects
- **State Management & Storage:** Vanilla JavaScript, Browser `LocalStorage`
- **Data Source:** JSON (`data/questions.json`)

---

## 📁 Project Structure

```text
├── index.html          # Login Page
├── register.html       # Student Registration Page
├── quiz.html           # Active Quiz Session Page
├── result.html         # Quiz Performance & History Page
├── css/
│   └── style.css       # Custom Glassmorphism & Neon Theme Styles
├── js/
│   ├── auth.js         # Authentication, Form Validation & Email Suggestions
│   ├── quiz.js         # Quiz Logic, Timer & Navigation
│   └── result.js       # Score Calculation & Attempt History Tracking
└── data/
    └── questions.json  # Question Dataset