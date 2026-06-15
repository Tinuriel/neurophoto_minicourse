// ── ДИНАМІЧНА ДАТА СТАРТУ ──

function getMonthName(monthIndex) {
  var months = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ];
  return months[monthIndex];
}

function updateStartDate() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var day = tomorrow.getDate();
  var month = getMonthName(tomorrow.getMonth());
  var formatted = day + ' ' + month;

  var heroDate = document.getElementById('date-hero');
  var ctaDate = document.getElementById('date-cta');

  if (heroDate) heroDate.textContent = formatted;
  if (ctaDate) ctaDate.textContent = formatted;
}

updateStartDate();
setInterval(updateStartDate, 60000);

// ── ТАЙМЕР ЗВОРОТНОГО ВІДЛІКУ (3 години) ──

var timerEnd = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);

function updateTimer() {
  var now = new Date();
  var remaining = timerEnd - now;

  if (remaining <= 0) {
    document.getElementById('timer-hours').textContent = '00';
    document.getElementById('timer-minutes').textContent = '00';
    document.getElementById('timer-seconds').textContent = '00';
    return;
  }

  var hours = Math.floor(remaining / (1000 * 60 * 60));
  var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  document.getElementById('timer-hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
}

updateTimer();
setInterval(updateTimer, 1000);

// ── ПЛАВАЮЧА КНОПКА ──

var floatBtn = document.getElementById('float-btn');
var scrollThreshold = 400;

function handleScroll() {
  if (window.pageYOffset > scrollThreshold) {
    floatBtn.classList.add('visible');
  } else {
    floatBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleScroll);

// ── АКОРДЕОН ПРОГРАМИ (Дні 1-7) ──


function toggleAcc(header) {
  const body = header.nextElementSibling;
  const isOpen = body.classList.contains('open');

  // Закриваємо всі відкриті
  document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.acc-header').forEach(h => h.classList.remove('active'));

  // Відкриваємо поточний якщо він був закритий
  if (!isOpen) {
    body.classList.add('open');
    header.classList.add('active');
  }
}

// ── АКОРДЕОН FAQ ──

function toggleFaq(header) {
  const body = header.nextElementSibling;
  const isOpen = body.classList.contains('open');

  // Закриваємо всі відкриті
  document.querySelectorAll('.faq-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.faq-header').forEach(h => h.classList.remove('active'));

  // Відкриваємо поточний якщо він був закритий
  if (!isOpen) {
    body.classList.add('open');
    header.classList.add('active');
  }
}

// ── GALLERY CAROUSEL ──
(function() {
  const track = document.getElementById('galleryTrack');
  const dotsContainer = document.getElementById('galleryDots');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  if (!track) return;

  const cards = track.querySelectorAll('.gallery-card');
  const total = cards.length;
  let current = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goTo(i);
    dotsContainer.appendChild(dot);
  });

  function isDesktop() { return window.innerWidth >= 640; }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));

    if (isDesktop()) {
      // Desktop: cards are full width, no margin offset
      const cardWidth = cards[0].offsetWidth;
      track.style.transform = `translateX(${-current * cardWidth}px)`;
    } else {
      // Mobile: cards have 8px margin each side, carousel has -24px offset
      const cardWidth = cards[0].offsetWidth + 16;
      track.style.transform = `translateX(${-current * cardWidth + 8}px)`;
    }

    dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.onclick = () => goTo(current - 1);
  nextBtn.onclick = () => goTo(current + 1);
  goTo(0);

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });

  // Mouse drag
  let dragging = false, dragStartX = 0;
  track.parentElement.addEventListener('mousedown', e => { dragging = true; dragStartX = e.clientX; });
  window.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });

  // Recalc on resize
  window.addEventListener('resize', () => goTo(current));
})();
