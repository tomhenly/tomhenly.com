const slides=document.querySelectorAll(".slide");
const carousel=document.querySelector(".carousel");
const detailPanel=document.getElementById("detailPanel");
const detailTitle=document.getElementById("detailTitle");
const detailYear=document.getElementById("detailYear");
const detailType=document.getElementById("detailType");
const detailLocation=document.getElementById("detailLocation");
const detailDesc=document.getElementById("detailDesc");
const header=document.getElementById("siteHeader");
const progressContainer=document.querySelector(".progress-dots");
const progressIndicator=document.querySelector(".progress-indicator");
const scrollHint=document.querySelector(".scroll-hint");
const navPrev=document.querySelector(".nav-prev");
const navNext=document.querySelector(".nav-next");

let current=0;
let stage="carousel";   // "carousel" | "focused" | "inline"
let scrollLocked=false;

/* --- setup dots --- */
slides.forEach((_, i)=>{
  const dot = document.createElement("span");
  dot.addEventListener("click", ()=>{
    if(stage==="carousel"){
      current=i;
      updateSlides();
    }
  });
  progressContainer.appendChild(dot);
});

function updateSlides(){
  const total=slides.length;
  slides.forEach(s=>s.classList.remove("prev","next","active","hidden"));
  
  const prev=(current-1+total)%total;
  const next=(current+1)%total;
  
  slides.forEach((s,i)=>{
    if(i===current) s.classList.add("active");
    else if(i===prev) s.classList.add("prev");
    else if(i===next) s.classList.add("next");
    else s.classList.add("hidden");
  });
  
  const dots=progressContainer.querySelectorAll("span");
  dots.forEach((d,i)=>d.classList.toggle("active",i===current));
}

updateSlides();

function nextSlide(){
  if(stage!=="carousel")return;
  current=(current+1)%slides.length;
  updateSlides();
}

function prevSlide(){
  if(stage!=="carousel")return;
  current=(current-1+slides.length)%slides.length;
  updateSlides();
}

/* --- Navigation button handlers --- */
navPrev.addEventListener("click", (e)=>{
  e.stopPropagation();
  prevSlide();
});

navNext.addEventListener("click", (e)=>{
  e.stopPropagation();
  nextSlide();
});

/* --- State changes --- */
function focusSlide(i){
  stage="focused";
  const s=slides[i];
  s.classList.add("focus");
  
  slides.forEach((el,idx)=>{
    if(idx!==i) el.classList.add("dim");
  });
  
  // Populate detail panel
  detailTitle.textContent=s.querySelector(".slide-title").textContent;
  detailYear.textContent=s.dataset.year;
  detailType.textContent=s.dataset.type;
  detailLocation.textContent=s.dataset.location;
  detailDesc.textContent=s.dataset.desc;
  
  // Update UI hints
  scrollHint.classList.add("hidden");
}

function unfocusSlide(){
  stage="carousel";
  slides.forEach(s=>s.classList.remove("focus","dim"));
  scrollHint.classList.remove("hidden");
}

function openInline(){
  if(stage!=="focused")return;
  stage="inline";
  
  // Slide carousel up and detail panel up together
  carousel.classList.add("slide-up");
  detailPanel.classList.add("open");
  progressIndicator.classList.add("hidden");
}

function closeInline(){
  if(stage!=="inline")return;
  stage="focused";
  
  // Slide both elements back down together
  carousel.classList.remove("slide-up");
  detailPanel.classList.remove("open");
  progressIndicator.classList.remove("hidden");
}

/* --- Click handlers --- */
slides.forEach((s,i)=>{
  s.addEventListener("click",(e)=>{
    // Don't interfere with nav buttons
    if(e.target.closest('.nav-arrow')) return;
    
    if(stage==="inline"){
      closeInline();
      setTimeout(()=>unfocusSlide(), 600);
      return;
    }
    
    // Clicking a different slide selects it
    if(i!==current){
      current=i;
      updateSlides();
      if(stage!=="carousel") unfocusSlide();
      return;
    }
    
    // Clicking active slide
    if(stage==="carousel"){
      focusSlide(i);
      updateSlides();
      return;
    }
    
    if(stage==="focused"){
      openInline();
      return;
    }
  });
});

/* --- Header click closes everything --- */
header.addEventListener("click",()=>{
  if(stage==="inline"){
    closeInline();
    setTimeout(()=>unfocusSlide(), 600);
  } else if(stage==="focused"){
    unfocusSlide();
  }
});

/* --- Scroll / swipe --- */
function debounceScroll(){
  scrollLocked=true;
  setTimeout(()=>scrollLocked=false, 600);
}

function onScroll(dir){
  if(scrollLocked)return;
  debounceScroll();

  if(stage==="carousel"){
    if(dir==="down") nextSlide();
    else if(dir==="up") prevSlide();
  }
  else if(stage==="focused"){
    if(dir==="down") openInline();
    else if(dir==="up") unfocusSlide();
  }
  else if(stage==="inline"){
    if(dir==="up"){
      closeInline();
    }
  }
}

window.addEventListener("wheel",(e)=>{
  const d = e.deltaY>30 ? "down" : e.deltaY<-30 ? "up" : null;
  if(d) onScroll(d);
},{passive:true});

// Touch events
let tStart=0, tEnd=0;
window.addEventListener("touchstart",(e)=>{
  tStart=e.touches[0].clientY;
},{passive:true});

window.addEventListener("touchmove",(e)=>{
  tEnd=e.touches[0].clientY;
},{passive:true});

window.addEventListener("touchend",()=>{
  const diff=tStart-tEnd;
  if(Math.abs(diff)<40)return;
  const dir = diff>0 ? "down" : "up";
  onScroll(dir);
});

/* --- Keyboard --- */
window.addEventListener("keydown",(e)=>{
  if(stage==="carousel"){
    if(e.key==="ArrowRight") nextSlide();
    if(e.key==="ArrowLeft") prevSlide();
    if(e.key==="ArrowDown") nextSlide();
    if(e.key==="ArrowUp") prevSlide();
  }
  
  if(stage==="focused"){
    if(e.key==="Escape") unfocusSlide();
    if(e.key==="ArrowDown" || e.key===" " || e.key==="Enter") {
      e.preventDefault();
      openInline();
    }
    if(e.key==="ArrowUp") unfocusSlide();
  }
  
  if(stage==="inline"){
    if(e.key==="Escape" || e.key==="ArrowUp"){
      closeInline();
    }
  }
});

/* --- Detail CTA button --- */
document.querySelector('.detail-cta').addEventListener('click', (e)=>{
  e.stopPropagation();
  console.log('View full project clicked');
  // Add your project page navigation here
});
