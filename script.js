document.addEventListener("DOMContentLoaded", () => {
  // Update footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Typing animation
  const text = "Tom Henly";
  const typingEl = document.getElementById("typing-text");
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      typingEl.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 120); // speed in ms
    }
  }

  typeWriter();
});
