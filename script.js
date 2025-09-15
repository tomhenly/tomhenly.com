document.addEventListener("DOMContentLoaded", () => {
  // Footer year update
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

  // Intersection Observer for scroll fade-in
  const items = document.querySelectorAll('.grid-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // run once
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
});
