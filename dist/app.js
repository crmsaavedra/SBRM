const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const isReducedMotion = () => reducedMotionQuery.matches;

const header = document.querySelector('[data-header]');
const progressBar = document.querySelector('.scroll-progress span');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const hero = document.querySelector('.hero');
const routeGraphic = document.querySelector('[data-route-graphic]');

function setMenu(open) {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

function updateScrollChrome() {
  header?.classList.toggle('is-scrolled', window.scrollY > 32);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progressBar) progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
}

window.addEventListener('scroll', updateScrollChrome, { passive: true });
updateScrollChrome();

const countdown = document.querySelector('[data-countdown]');
const countdownParts = {
  days: document.getElementById('countdownDays'),
  hours: document.getElementById('countdownHours'),
  minutes: document.getElementById('countdownMinutes'),
  seconds: document.getElementById('countdownSeconds')
};

function updateCountdown() {
  if (!countdown) return;
  const eventStart = new Date(document.documentElement.dataset.eventStart).getTime();
  const remaining = eventStart - Date.now();
  if (remaining <= 0) {
    countdown.classList.add('is-live');
    countdown.querySelector('.micro-label').textContent = 'AHORA';
    Object.values(countdownParts).forEach((part) => { if (part) part.textContent = '—'; });
    return;
  }
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownParts.days.textContent = String(days).padStart(3, '0');
  countdownParts.hours.textContent = String(hours).padStart(2, '0');
  countdownParts.minutes.textContent = String(minutes).padStart(2, '0');
  countdownParts.seconds.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealItems = document.querySelectorAll('.reveal');
if (isReducedMotion() || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionLinks = [...document.querySelectorAll('[data-nav]')];
const observedSections = sectionLinks
  .map((link) => document.getElementById(link.dataset.nav))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.nav === entry.target.id));
    });
  }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

const programTriggers = [...document.querySelectorAll('[data-program-trigger]')];
const programPanels = [...document.querySelectorAll('[data-program-panel]')];

function setProgramDay(day) {
  programTriggers.forEach((trigger) => {
    const active = trigger.dataset.programTrigger === day;
    trigger.classList.toggle('is-active', active);
    trigger.setAttribute('aria-selected', String(active));
    trigger.tabIndex = active ? 0 : -1;
  });
  programPanels.forEach((panel) => {
    panel.hidden = panel.dataset.programPanel !== day;
    panel.classList.toggle('is-active', panel.dataset.programPanel === day);
  });
}

programTriggers.forEach((trigger, index) => {
  trigger.addEventListener('click', () => setProgramDay(trigger.dataset.programTrigger));
  trigger.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + direction + programTriggers.length) % programTriggers.length;
    programTriggers[next].focus();
    setProgramDay(programTriggers[next].dataset.programTrigger);
  });
});

const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
accordionTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  });
});

const dialog = document.getElementById('eventDialog');
const dialogContent = document.querySelectorAll('[data-dialog-content]');
const dialogTitle = document.getElementById('dialogTitle');

function openDialog(type = 'general') {
  if (!dialog) return;
  dialogContent.forEach((content) => { content.hidden = content.dataset.dialogContent !== type; });
  if (dialogTitle) dialogTitle.setAttribute('tabindex', '-1');
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  dialog.querySelector('.dialog-close')?.focus();
}

function closeDialog() {
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => openDialog(button.dataset.openModal));
});
document.querySelector('[data-close-dialog]')?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4600);
}
document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));

if (hero && routeGraphic && !isReducedMotion() && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    routeGraphic.style.transform = `translate3d(${x * 12}px, ${y * 8}px, 0)`;
  });
  hero.addEventListener('pointerleave', () => { routeGraphic.style.transform = ''; });
}

document.querySelector('.hero-media img')?.addEventListener('error', () => hero?.classList.add('image-missing'));

reducedMotionQuery.addEventListener?.('change', (event) => {
  document.documentElement.classList.toggle('reduced-motion', event.matches);
  if (event.matches) revealItems.forEach((item) => item.classList.add('visible'));
});
