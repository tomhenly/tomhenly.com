// Year
document.getElementById("year").innerText = new Date().getFullYear();

// Simple demo projects & images
const PROJECTS = {
  project1: [
    "https://images.unsplash.com/photo-1497302347632-904729bc24aa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1520975918311-6c51a8991a55?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80",
  ],
  project2: [
    "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=1600&q=80",
  ],
};

// Elements
const cards = document.querySelectorAll(".card");
const viewer = document.getElementById("project-viewer");
const closeBtn = document.getElementById("closeViewer");
const slides = [
  document.getElementById("slide1"),
  document.getElementById("slide2"),
  document.getElementById("slide3"),
];

// Open viewer
cards.forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.dataset.project;
    const images = PROJECTS[id];
    if (!images) return;
    images.forEach((src, i) => (slides[i].src = src));
    viewer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
});

// Close viewer
closeBtn.addEventListener("click", () => {
  viewer.classList.add("hidden");
  document.body.style.overflow = "";
});

// Optional: allow Esc key to close
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    viewer.classList.add("hidden");
    document.body.style.overflow = "";
  }
});
