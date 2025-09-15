// Update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
});

// Typing animation
const text = "Hello, I’m Tom Henly 👋";
const typingEl = document.getElementById("typing-text");

let i = 0;
function typeWriter() {
  if (i < text.length) {
    typingEl.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100); // speed of typing
  }
}
typeWriter();
