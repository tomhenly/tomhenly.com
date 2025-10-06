const slides = document.querySelectorAll(".slide");
const detailPanel = document.getElementById("detailPanel");
const detailTitle = document.getElementById("detailTitle");
const detailMeta  = document.getElementById("detailMeta");
const detailDesc  = document.getElementById("detailDesc");

let current = 0;
let stage = "carousel"; // "carousel" | "focused" | "inline"

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
}
updateSlides();

function nextSlide(){if(stage!=="carousel")return;current=(current+1)%slides.length;updateSlides();}
function prevSlide(){if(stage!=="carousel")return;current=(current-1+slides.length)%slides.length;updateSlides();}

slides.forEach((s,i)=>{
  // clicking body of slide
  s.addEventListener("click",()=>{
    if(stage==="carousel"){ focusSlide(i); current=i; updateSlides(); }
  });
  // clicking view-more cue opens inline directly
  s.querySelector(".view-more-cue").addEventListener("click",e=>{
    e.stopPropagation();
    if(stage==="carousel"){focusSlide(i);}
    openInline();
  });
});

function focusSlide(i){
  stage="focused";
  const slide=slides[i];
  slide.classList.add("focus");
  slides.forEach((el,idx)=>{ if(idx!==i) el.classList.add("dim"); });
  detailTitle.textContent=slide.querySelector("h2").textContent;
  detailMeta.textContent=`${slide.dataset.year} | ${slide.dataset.type}`;
  detailDesc.textContent=slide.dataset.desc;
}
function unfocusSlide(){ stage="carousel"; slides.forEach(s=>s.classList.remove("focus","dim")); }

function openInline(){
  if(stage==="inline")return;
  stage="inline";
  detailPanel.classList.remove("hidden");
  requestAnimationFrame(()=>detailPanel.classList.add("open"));
}
function closeInline(){
  if(stage!=="inline")return;
  stage="focused";
  detailPanel.classList.remove("open");
  setTimeout(()=>detailPanel.classList.add("hidden"),400);
}

/* handle scrolling as stage machine */
function onScroll(dir){
  if(stage==="carousel"){
     if(dir==="down") nextSlide();
     else if(dir==="up") prevSlide();
  }else if(stage==="focused"){
     if(dir==="down") openInline();
     else if(dir==="up") unfocusSlide();
  }else if(stage==="inline" && dir==="up"){
     closeInline();
  }
}
window.addEventListener("wheel",e=>{
  const d=e.deltaY>30?"down":e.deltaY<-30?"up":null;
  if(d) onScroll(d);
},{passive:true});

let touchStartY=0,touchEndY=0;
window.addEventListener("touchstart",e=>{touchStartY=e.touches[0].clientY;},{passive:true});
window.addEventListener("touchmove",e=>{touchEndY=e.touches[0].clientY;},{passive:true});
window.addEventListener("touchend",()=>{
  const diff=touchStartY-touchEndY;
  if(Math.abs(diff)<40)return;
  const dir=diff>0?"down":"up";
  onScroll(dir);
});
