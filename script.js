const BASE_URL = "http://127.0.0.1:5000";
const roleSelect = document.getElementById("roleSelect");
const roleShowcase = document.getElementById("roleShowcase");
const roleLoading = document.getElementById("roleLoading");
const skillsInput = document.getElementById("skillsInput");
const chipsInput = document.getElementById("chipsInput");
const checkBtn = document.getElementById("checkBtn");
const autoFillBtn = document.getElementById("autoFillBtn");
const resultArea = document.getElementById("resultArea");
const missingList = document.getElementById("missingList");
const recommendationsList = document.getElementById("recommendationsList");
const missingCount = document.getElementById("missingCount");
const matchBadge = document.getElementById("matchBadge");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");

let chips = [];

function showToast(msg, time=2200){
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(()=> toast.classList.add("hidden"), time);
}

function renderChips(){
  chipsInput.querySelectorAll(".chip").forEach(n=>n.remove());
  chips.forEach((c,i)=>{
    const span = document.createElement("span");
    span.className = "chip";
    span.innerHTML = `<span>${c}</span><span class="x" data-i="${i}">✕</span>`;
    chipsInput.insertBefore(span, skillsInput);
  });
}

chipsInput.addEventListener("click", ()=> skillsInput.focus());

chipsInput.addEventListener("keydown", (e)=>{
  if(e.target !== skillsInput) return;
  if(e.key === "Enter" || e.key === "," ){
    e.preventDefault();
    const raw = skillsInput.value.trim().replace(/,+$/,'');
    if(raw) {
      raw.split(",").map(s=>s.trim()).filter(Boolean).forEach(s=>{
        if(!chips.includes(cap(s))) chips.push(cap(s));
      });
      skillsInput.value = "";
      renderChips();
    }
  } else if(e.key === "Backspace" && skillsInput.value === ""){
    chips.pop();
    renderChips();
  }
});

chipsInput.addEventListener("click", (e)=>{
  if(e.target.classList.contains("x")){
    const i = Number(e.target.dataset.i);
    chips.splice(i,1);
    renderChips();
  }
});

function cap(s){ return s.split(" ").map(w=> w.charAt(0).toUpperCase()+w.slice(1)).join(" ") }

async function loadRoles(){
  roleLoading.classList.add("hidden");
  try{
    const res = await fetch(`${BASE_URL}/roles`);
    if(!res.ok) throw new Error("Failed");
    const roles = await res.json();
    roleSelect.innerHTML = roles.map(r=> `<option value="${r}">${r}</option>`).join("");
    roleShowcase.innerHTML = roles.slice(0,6).map(r=>{
      const abbr = r.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase();
      return `<div class="role-badge"><div class="role-avatar">${abbr}</div><div class="role-meta"><div class="role-name">${r}</div><div class="role-sub">Click to preview</div></div></div>`;
    }).join("");
    document.querySelectorAll(".role-badge").forEach((el,i)=>{
      el.addEventListener("click", ()=>{
        roleSelect.selectedIndex = i;
        showToast(`Selected ${roleSelect.value}`);
      });
    });
  }catch(e){
    roleSelect.innerHTML = `<option>Error loading roles</option>`;
  }
}

async function autoFillFromRole(){
  const role = roleSelect.value;
  if(!role) return showToast("Select a role first");
  try{
    const res = await fetch(`${BASE_URL}/role-skills?role=${encodeURIComponent(role)}`);
    if(!res.ok) throw new Error("No data");
    const data = await res.json();
    chips = data.skills.map(s=>cap(s));
    renderChips();
    showToast("Auto-filled skills for role");
  }catch(e){
    showToast("Auto-fill failed");
  }
}

function gatherSkills(){
  const inputSkills = skillsInput.value.trim();
  const combined = [...chips];
  if(inputSkills){
    inputSkills.split(",").map(s=>s.trim()).filter(Boolean).forEach(s=> {
      const c = cap(s);
      if(!combined.includes(c)) combined.push(c);
    });
  }
  return combined;
}

function renderResult(data){
  resultArea.classList.remove("hidden");
  missingList.innerHTML = "";
  recommendationsList.innerHTML = "";
  const missing = data.missingSkills || [];
  missingCount.textContent = `${missing.length} ${missing.length===1? 'skill':'skills'}`;
  matchBadge.textContent = `${Math.round((1 - missing.length/(data.total||1))*100)}% match`;
  if(missing.length===0){
    missingList.innerHTML = `<div class="miss-item">None — you're job-ready 🎉</div>`;
  }else{
    missing.forEach(ms=>{
      const el = document.createElement("div");
      el.className = "miss-item";
      el.textContent = ms;
      missingList.appendChild(el);
    });
  }
  (data.recommendations || []).forEach(rec=>{
    const li = document.createElement("li");
    li.textContent = rec;
    recommendationsList.appendChild(li);
  });
}

async function checkSkillGap(){
  const role = roleSelect.value;
  const userSkills = gatherSkills();
  if(!role || userSkills.length===0) return showToast("Select role and add skills");
  resultArea.classList.remove("hidden");
  missingList.innerHTML = `<div class="skeleton" style="height:12px;width:60%;margin-bottom:8px"></div>`;
  try{
    const res = await fetch(`${BASE_URL}/analyze`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ role, userSkills })
    });
    if(!res.ok) throw new Error("Analysis failed");
    const data = await res.json();
    renderResult(data);
  }catch(e){
    showToast("Analysis error");
  }
}

/* theme toggle */
let dark = true;
themeToggle.addEventListener("click", ()=>{
  dark = !dark;
  if(!dark){
    document.documentElement.style.setProperty('--bg1','#f7f7fb');
    document.documentElement.style.setProperty('--glass','rgba(2,6,23,0.04)');
    document.documentElement.style.setProperty('--muted','#374151');
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.style.removeProperty('--bg1');
    document.documentElement.style.removeProperty('--glass');
    document.documentElement.style.removeProperty('--muted');
    themeToggle.textContent = '🌙';
  }
});

/* events */
window.addEventListener("load", ()=> {
  loadRoles();
});
checkBtn.addEventListener("click", checkSkillGap);
autoFillBtn.addEventListener("click", autoFillFromRole);
