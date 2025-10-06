const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let current = 2; // start centered

function updateSlides() {
  slides.forEach((s, i) => s.classList.remove("prev","next","active","hidden"));

  // circular index helpers
  const total = slides.length;
  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;

  slides.forEach((s,i)=>{
    if(i===current) s.classList.add("active");
    else if(i===prev) s.classList.add("prev");
    else if(i===next) s.classList.add("next");
    else s.classList.add("hidden");
  });
}

function nextSlide() {
  current = (current + 1) % slides.length;
  updateSlides();
}
function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  updateSlides();
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Click sides to change
document.querySelector(".slides").addEventListener("click",(e)=>{
  const bounds = e.currentTarget.getBoundingClientRect();
  if(e.clientX > bounds.left + bounds.width/2) nextSlide();
  else prevSlide();
});

updateSlides();

/* -------------- Modal logic -------------- */
const modal = document.getElementById("detailModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalDesc = document.getElementById("modalDesc");
const closeBtn = document.getElementById("closeBtn");

slides.forEach(slide=>{
  slide.addEventListener("click", e=>{
    // open modal only if active
    if(!slide.classList.contains("active")) return;
    const color = slide.style.backgroundColor;
    modalImage.src = `https://placehold.co/900x500/${color.replace("#","")}/ffffff?text=${encodeURIComponent(slide.querySelector("h2").textContent)}`;
    modalTitle.textContent = slide.querySelector("h2").textContent;
    modalMeta.textContent = slide.querySelector("p").textContent;
    modal.classList.remove("hidden");
  });
});

closeBtn.addEventListener("click", ()=> modal.classList.add("hidden"));
modal.querySelector(".backdrop")?.addEventListener("click", ()=> modal.classList.add("hidden"));
