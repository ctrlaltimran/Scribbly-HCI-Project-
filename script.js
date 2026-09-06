const $ = (q,ctx=document)=>ctx.querySelector(q);
const $$ = (q,ctx=document)=>[...ctx.querySelectorAll(q)];

// mobile menu
const menuToggle = $('#menuToggle');
const nav = $('.main-nav');
if(menuToggle && nav){
  menuToggle.addEventListener('click',()=>nav.classList.toggle('mobile-open'));
  $$('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('mobile-open')));
}

// reveal on scroll
const reveals = $$('.reveal');
if('IntersectionObserver' in window){
  const obs = new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
  }),{threshold:.12});
  reveals.forEach(el=>obs.observe(el));
}else{reveals.forEach(el=>el.classList.add('visible'))}

// active nav by section
const navLinks = $$('.main-nav a[href^="#"]');
const sections = $$('main section[id]');
if('IntersectionObserver' in window && navLinks.length){
  const sectionObs = new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href') === '#' + e.target.id));
    }
  }),{rootMargin:'-40% 0px -45% 0px'});
  sections.forEach(s=>sectionObs.observe(s));
}

// faq accordion
$$('.faq-item button').forEach(btn=>btn.addEventListener('click',()=>{
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  $$('.faq-item').forEach(i=>{i.classList.remove('open'); const icon=$('i',i); if(icon) icon.textContent='＋';});
  if(!isOpen){item.classList.add('open'); const icon=$('i',item); if(icon) icon.textContent='−';}
}));

// add to bag mock interaction
let bag = 0;
const bagCount = $('#bagCount');
const toast = $('#toast');
function showToast(message){
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>toast.classList.remove('show'),1800);
}
$$('.add-btn').forEach(btn=>btn.addEventListener('click',()=>{
  bag++;
  if(bagCount) bagCount.textContent=bag;
  const name=btn.closest('.product-card')?.dataset.product || 'Item';
  btn.innerHTML='Added <span>✓</span>';
  setTimeout(()=>btn.innerHTML='Add to bag <span>＋</span>',1100);
  showToast(`${name} added to your bag ✦`);
}));

// search overlay
const searchBtn=$('#searchBtn'), searchOverlay=$('#searchOverlay'), searchClose=$('#searchClose'), searchInput=$('#searchInput'), searchHint=$('#searchHint');
if(searchBtn&&searchOverlay){
  searchBtn.addEventListener('click',()=>{searchOverlay.classList.add('open');searchOverlay.setAttribute('aria-hidden','false');setTimeout(()=>searchInput?.focus(),150)});
  searchClose?.addEventListener('click',()=>{searchOverlay.classList.remove('open');searchOverlay.setAttribute('aria-hidden','true')});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')searchOverlay.classList.remove('open')});
  searchInput?.addEventListener('input',()=>{
    const q=searchInput.value.toLowerCase();
    const products=$$('.product-card').map(x=>x.dataset.product).filter(x=>x.toLowerCase().includes(q));
    searchHint.textContent=q ? (products.length ? `Matching: ${products.join(' · ')}` : 'No exact match — try notebook, pens, sticky or planner.') : 'Popular: notebook, pens, sticky notes, planner';
  });
}

// newsletter
$('#newsletterForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const msg=$('#newsletterMsg');
  if(msg) msg.textContent='You’re on the list. Tiny celebration! ✦';
  e.target.reset();
});

// custom cursor
const cursor=$('#cursorDot');
if(cursor && matchMedia('(pointer:fine)').matches){
  document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
  $$('a,button,.product-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
  });
}

// subtle tilt cards
if(matchMedia('(pointer:fine)').matches){
  $$('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      const base=card.classList.contains('desk-card') ? 2.2 : 0;
      card.style.transform=`perspective(900px) rotateX(${-y*3}deg) rotateY(${x*4}deg) rotateZ(${base}deg)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

// auth password reveal
$$('.show-password').forEach(btn=>btn.addEventListener('click',()=>{
  const input=document.getElementById(btn.dataset.target);
  if(!input) return;
  const show=input.type==='password'; input.type=show?'text':'password'; btn.textContent=show?'hide':'show';
}));

// demo auth forms
$('#loginForm')?.addEventListener('submit',e=>{e.preventDefault();showToast('Demo login complete ✦');setTimeout(()=>location.href='index.html',1000)});
$('#signupForm')?.addEventListener('submit',e=>{e.preventDefault();showToast('Welcome to Scribbly ✦');setTimeout(()=>location.href='index.html',1000)});

// bulk order quantity pills selector
$$('.qty-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    $$('.qty-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// bulk order form submission
$('#bulkForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#bulkFirstName')?.value || 'Friend';
  const qty = $('.qty-pill.active')?.dataset.qty || '25+';
  const product = $('#bulkProduct')?.value || 'stationery';
  showToast(`Bulk inquiry received, ${name}! We'll reply in 24h ✦`);
  e.target.reset();
  // Keep first pill active after reset
  const firstPill = $('.qty-pill');
  if (firstPill) {
    $$('.qty-pill').forEach(p => p.classList.remove('active'));
    firstPill.classList.add('active');
  }
});

