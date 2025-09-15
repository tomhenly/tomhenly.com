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
      setTimeout(typeWriter, 120);
    }
  }
  typeWriter();

  // Fade-in on scroll for grid
  const items = document.querySelectorAll('.grid-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
});
