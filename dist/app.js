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

const mapPlaces = {
  udec: {
    index: '01',
    type: 'CAMPUS / PATRIMONIO',
    tag: 'BASE ACADÉMICA',
    title: 'Universidad de Concepción',
    description: 'El campus central reúne el Campanil, el Foro, la Casa del Arte, la Biblioteca Central y una red de espacios que conectan formación, cultura y vida universitaria.',
    distance: 'PUNTO DE PARTIDA',
    coordinates: '36°49′S / 73°02′W',
    image: 'assets/campanil-day.jpg',
    alt: 'Campanil de la Universidad de Concepción durante el día',
    gallery: [
      { image: 'assets/campanil-day.jpg', alt: 'Campanil de la Universidad de Concepción', label: 'Campanil' },
      { image: 'assets/map-udec-biblioteca.jpg', alt: 'Acceso principal de la Biblioteca Central Luis David Cruz Ocampo', label: 'Biblioteca Central' },
      { image: 'assets/map-udec-arco.jpg', alt: 'Arco de la Universidad de Concepción', label: 'Arco UdeC' },
      { image: 'assets/map-udec-foro.jpg', alt: 'Vista desde el Foro de la Universidad de Concepción', label: 'Foro' },
      { image: 'assets/map-udec-casa-arte.jpg', alt: 'Casa del Arte de la Universidad de Concepción', label: 'Casa del Arte' }
    ]
  },
  parque: {
    index: '02',
    type: 'CIUDAD / VERDE URBANO',
    tag: 'PAUSA VERDE',
    title: 'Parque Ecuador',
    description: 'Un borde verde junto al Cerro Caracol para caminar, bajar el ritmo y leer la ciudad desde una escala más cercana.',
    distance: 'REFERENCIA DE RECORRIDO',
    coordinates: '36°49′S / 73°03′W',
    image: 'assets/map-parque-ecuador.jpg',
    alt: 'Parque Ecuador en Concepción',
    gallery: []
  },
  sanpedro: {
    index: '03',
    type: 'NATURALEZA / RIBERA',
    tag: 'CIRCUITO DE NATURALEZA',
    title: 'Laguna Grande · San Pedro de la Paz',
    description: 'Agua, bosque y borde urbano en una de las pausas naturales del Gran Concepción: un lugar para cambiar la conversación de escala.',
    distance: 'REFERENCIA DE RECORRIDO',
    coordinates: '36°51′S / 73°07′W',
    image: 'assets/map-san-pedro.jpg',
    alt: 'Laguna Grande en San Pedro de la Paz',
    gallery: []
  },
  talcahuano: {
    index: '04',
    type: 'PUERTO / IDENTIDAD',
    tag: 'PUERTO EN MOVIMIENTO',
    title: 'Puerto de Talcahuano',
    description: 'La relación del Biobío con el mar aparece aquí como trabajo, infraestructura, memoria y horizonte: la ciudad productiva también forma parte de la experiencia.',
    distance: 'REFERENCIA DE RECORRIDO',
    coordinates: '36°43′S / 73°06′W',
    image: 'assets/map-talcahuano.jpg',
    alt: 'Puerto de Talcahuano en la bahía',
    gallery: []
  },
  lota: {
    index: '05',
    type: 'PATRIMONIO / COSTA',
    tag: 'MEMORIA DEL TERRITORIO',
    title: 'Parque Isidora Cousiño · Lota',
    description: 'Un parque histórico frente al paisaje costero para entender cómo la memoria industrial y la naturaleza conviven en el sur del Biobío.',
    distance: 'REFERENCIA DE RECORRIDO',
    coordinates: '37°05′S / 73°10′W',
    image: 'assets/map-lota.jpg',
    alt: 'Parque Isidora Cousiño en Lota',
    gallery: []
  },
  tome: {
    index: '06',
    type: 'COSTA / PAISAJE',
    tag: 'HORIZONTE COSTERO',
    title: 'Playa de Tomé',
    description: 'Una salida hacia la costa del norte del Biobío: arena, bahía y una pausa abierta para mirar la región desde otro ángulo.',
    distance: 'REFERENCIA DE RECORRIDO',
    coordinates: '36°37′S / 72°57′W',
    image: 'assets/map-tome.jpg',
    alt: 'Playa de Tomé en la Región del Biobío',
    gallery: []
  },
  dichato: {
    index: '07',
    type: 'COSTA / DESCANSO',
    tag: 'BORDE DEL MAR',
    title: 'Costanera de Dichato',
    description: 'La costanera convierte el borde costero en recorrido: un paisaje que invita a caminar, conversar y cerrar el mapa mirando el Pacífico.',
    distance: 'REFERENCIA DE RECORRIDO',
    coordinates: '36°32′S / 72°55′W',
    image: 'assets/map-dichato.jpg',
    alt: 'Costanera de Dichato junto al mar',
    gallery: []
  }
};

const mapTriggers = [...document.querySelectorAll('[data-map-trigger]')];
const mapPlaceImage = document.getElementById('mapPlaceImage');
const mapPlaceIndex = document.getElementById('mapPlaceIndex');
const mapPlaceType = document.getElementById('mapPlaceType');
const mapPlaceTag = document.getElementById('mapPlaceTag');
const mapPlaceTitle = document.getElementById('mapPlaceTitle');
const mapPlaceDescription = document.getElementById('mapPlaceDescription');
const mapPlaceDistance = document.getElementById('mapPlaceDistance');
const mapPlaceCoordinates = document.getElementById('mapPlaceCoordinates');
const mapPlaceGallery = document.getElementById('mapPlaceGallery');

function renderMapGallery(place) {
  if (!mapPlaceGallery) return;
  mapPlaceGallery.replaceChildren();
  const gallery = place.gallery || [];
  mapPlaceGallery.hidden = gallery.length < 2;
  if (gallery.length < 2) return;

  gallery.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `map-gallery-thumb${index === 0 ? ' is-active' : ''}`;
    button.setAttribute('aria-label', `Ver foto: ${item.label}`);
    button.setAttribute('aria-pressed', String(index === 0));
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    button.append(image);
    button.addEventListener('click', () => {
      if (!mapPlaceImage) return;
      mapPlaceImage.src = item.image;
      mapPlaceImage.alt = item.alt;
      mapPlaceGallery.querySelectorAll('.map-gallery-thumb').forEach((thumb) => {
        const active = thumb === button;
        thumb.classList.toggle('is-active', active);
        thumb.setAttribute('aria-pressed', String(active));
      });
    });
    mapPlaceGallery.append(button);
  });
}

function setMapPlace(placeId) {
  const place = mapPlaces[placeId];
  if (!place) return;
  mapTriggers.forEach((trigger) => {
    const active = trigger.dataset.mapTrigger === placeId;
    trigger.classList.toggle('is-active', active);
    trigger.setAttribute('aria-pressed', String(active));
  });
  if (mapPlaceIndex) mapPlaceIndex.textContent = place.index;
  if (mapPlaceType) mapPlaceType.textContent = place.type;
  if (mapPlaceTag) mapPlaceTag.textContent = place.tag;
  if (mapPlaceTitle) mapPlaceTitle.textContent = place.title;
  if (mapPlaceDescription) mapPlaceDescription.textContent = place.description;
  if (mapPlaceDistance) mapPlaceDistance.textContent = place.distance;
  if (mapPlaceCoordinates) mapPlaceCoordinates.textContent = place.coordinates;
  if (mapPlaceImage) {
    mapPlaceImage.src = place.image;
    mapPlaceImage.alt = place.alt;
    mapPlaceImage.classList.remove('is-changing');
    if (!isReducedMotion()) {
      void mapPlaceImage.offsetWidth;
      mapPlaceImage.classList.add('is-changing');
    }
  }
  renderMapGallery(place);
}

mapTriggers.forEach((trigger) => trigger.addEventListener('click', () => setMapPlace(trigger.dataset.mapTrigger)));
Object.values(mapPlaces).forEach((place) => {
  [place.image, ...(place.gallery || []).map((item) => item.image)].forEach((imagePath) => {
    const image = new Image();
    image.src = imagePath;
  });
});
setMapPlace('udec');

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
