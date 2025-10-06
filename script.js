const slides=document.querySelectorAll(".slide");
const detailPanel=document.getElementById("detailPanel");
const detailTitle=document.getElementById("detailTitle");
const detailMeta=document.getElementById("detailMeta");
const detailDesc=document.getElementById("detailDesc");
const header=document.getElementById("siteHeader");
const progressContainer=document.querySelector(".progress-dots");

let current=0;
let stage="carousel";   // "carousel" | "focused" | "inline"
let scrollLocked=false;

/* --- setup dots --- */
slides.forEach(()=>progressContainer.appendChild(document.createElement("span")));

function updateSlides(){
  const total=slides.length;
  slides.forEach(s=>s.classList.remove("prev","next","active","hidden"));
  const prev=(current-1+total)%total;
  const next=(current+1)%total;
  slides.forEach((s,i)=>{
    if(i===current)s.classList.add("active");
    else if(i===prev)s.classList.add("prev");
    else if(i===next)s.classList.add("next");
    else s.classList.add("hidden");
  });
  const dots=progressContainer.querySelectorAll("span");
  dots.forEach((d,i)=>d.classList.toggle("active",i===current));
}
updateSlides();

function nextSlide(){if(stage!=="carousel")return;current=(current+1)%slides.length;updateSlides();}
function prevSlide(){if(stage!=="carousel")return;current=(current-1+slides.length)%slides.length;updateSlides();}

/* --- state changes --- */
function focusSlide(i){
  stage="focused";
  const s=slides[i];
  s.classList.add("focus");
  slides.forEach((el,idx)=>{if(idx!==i)el.classList.add("dim");});
  detailTitle.textContent=s.querySelector("h2").textContent;
  detailMeta.textContent=`${s.dataset.year} | ${s.dataset.type}`;
  detailDesc.textContent=s.dataset.desc;
}
function unfocusSlide(){stage="carousel";slides.forEach(s=>s.classList.remove("focus","dim"));}
function openInline(){if(stage!=="focused")return;stage="inline";detailPanel.classList.remove("hidden");requestAnimationFrame(()=>detailPanel.classList.add("open"));}
function closeInline(){if(stage!=="inline")return;stage="focused";detailPanel.classList.remove("open");setTimeout(()=>detailPanel.classList.add("hidden"),400);}

/* --- click handlers --- */
slides.forEach((s,i)=>{
  const cue=s.querySelector(".view-more-cue");
  s.addEventListener("click",()=>{
    if(stage==="inline"){closeInline();unfocusSlide();return;}
    // clicking a different slide just scrolls/selects it
    if(i!==current){
      current=i;updateSlides();
      if(stage!=="carousel")unfocusSlide();
      return;
    }
    // clicking active slide
    if(stage==="carousel"){focusSlide(i);updateSlides();return;}
    if(stage==="focused"){openInline();return;}
  });
  cue.addEventListener("click",e=>{
    e.stopPropagation();
    if(stage==="carousel"){focusSlide(i);current=i;updateSlides();}
    openInline();
  });
});

/* --- header click closes inline --- */
header.addEventListener("click",()=>{
  if(stage==="inline"){closeInline();unfocusSlide();}
});

/* --- scroll / swipe --- */
function debounceScroll(){scrollLocked=true;setTimeout(()=>scrollLocked=false,400);}
function onScroll(dir){
  if(scrollLocked)return;debounceScroll();

  if(stage==="carousel"){
    if(dir==="down")nextSlide();else if(dir==="up")prevSlide();
  }else if(stage==="focused"){
    if(dir==="down")openInline();else if(dir==="up")unfocusSlide();
  }else if(stage==="inline"&&dir==="up"){closeInline();}
}
window.addEventListener("wheel",e=>{
  const d=e.deltaY>30?"down":e.deltaY<-30?"up":null;
  if(d)onScroll(d);
},{passive:true});
let tStart=0,tEnd=0;
window.addEventListener("touchstart",e=>{tStart=e.touches[0].clientY;},{passive:true});
window.addEventListener("touchmove",e=>{tEnd=e.touches[0].clientY;},{passive:true});
window.addEventListener("touchend",()=>{
  const diff=tStart-tEnd;
  if(Math.abs(diff)<40)return;
  const dir=diff>0?"down":"up";
  onScroll(dir);
});

/* --- keyboard --- */
window.addEventListener("keydown",e=>{
  if(stage==="carousel"){
    if(e.key==="ArrowRight")nextSlide();
    if(e.key==="ArrowLeft")prevSlide();
  }
  if(stage==="focused"&&e.key==="Escape")unfocusSlide();
  if(stage==="inline"&&e.key==="Escape"){closeInline();unfocusSlide();}
});
