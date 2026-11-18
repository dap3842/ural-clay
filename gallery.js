const links = [...document.querySelectorAll('.photo')];
const viewer = document.querySelector('#viewer');
const full = document.querySelector('#full-photo');
const caption = document.querySelector('#photo-caption');
let current = 0;
let opener;
function show(i) {
  current = (i + links.length) % links.length;
  full.alt = links[current].querySelector('img').alt;
  full.src = links[current].href;
  caption.textContent = `${current + 1} / ${links.length} · ${full.alt}`;
}
links.forEach((link, i) => link.addEventListener('click', e => {
  if (!viewer.showModal || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); opener = link; show(i); viewer.showModal();
  document.querySelector('#close-photo').focus();
}));
viewer.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.step))));
viewer.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault(); show(current + (e.key === 'ArrowLeft' ? -1 : 1));
  }
});
viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
document.querySelector('#close-photo').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => opener?.focus());
const chapters = [...document.querySelectorAll('article section[id]')];
let ticking = false;
function update() {
  const active = chapters.filter(ch => ch.getBoundingClientRect().top <= innerHeight * .35).at(-1);
  document.querySelectorAll('nav a[href^="#chapter-"]').forEach(a => {
    if (a.hash === `#${active?.id}`) a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  });
  const range = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--reading', `${range > 0 ? scrollY / range * 100 : 0}%`);
  ticking = false;
}
function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
addEventListener('scroll', schedule, {passive:true});
addEventListener('resize', schedule);
addEventListener('load', schedule);
update();
