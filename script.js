document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  document.querySelectorAll("#year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Typing animation (only on index.html)
  const typingEl = document.getElementById("typing-text");
  if (typingEl) {
    const text = "Tom Henly";
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        typingEl.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 120);
      }
    }
    typeWriter();
  }

  // Scroll fade-in (only if grid exists)
  const items = document.querySelectorAll('.grid-item');
  if (items.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
  }
});
