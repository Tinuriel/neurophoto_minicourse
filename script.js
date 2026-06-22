// ── ДИНАМІЧНА ДАТА СТАРТУ (легасі-блоки, якщо є в HTML) ──

function getMonthName(monthIndex) {
  var months = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ];
  return months[monthIndex];
}

function updateStartDate() {
  var heroDate = document.getElementById('date-hero');
  var ctaDate = document.getElementById('date-cta');
  if (!heroDate && !ctaDate) return;

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var day = tomorrow.getDate();
  var month = getMonthName(tomorrow.getMonth());
  var formatted = day + ' ' + month;

  if (heroDate) heroDate.textContent = formatted;
  if (ctaDate) ctaDate.textContent = formatted;
}

updateStartDate();
setInterval(updateStartDate, 60000);

// ── ТАЙМЕР ЗВОРОТНОГО ВІДЛІКУ (до кінця поточного тижня, неділя 23:59 за Києвом) ──

function getWeekDeadline() {
  var now = new Date();
  var kyivOffsetMs = 3 * 60 * 60 * 1000; // EEST, UTC+3
  var kyivNow = new Date(now.getTime() + kyivOffsetMs - (now.getTimezoneOffset() * 60000));
  var daysUntilSunday = (7 - kyivNow.getDay()) % 7;
  var deadline = new Date(kyivNow);
  deadline.setDate(kyivNow.getDate() + daysUntilSunday);
  deadline.setHours(23, 59, 59, 0);
  return { deadline: deadline, kyivNow: kyivNow };
}

function updateTimer() {
  var dEl = document.getElementById('timer-days');
  var hEl = document.getElementById('timer-hours');
  var mEl = document.getElementById('timer-minutes');
  if (!dEl && !hEl && !mEl) return;

  var ref = getWeekDeadline();
  var remaining = ref.deadline - ref.kyivNow;
  if (remaining < 0) remaining = 0;

  var days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (dEl) dEl.textContent = days.toString().padStart(2, '0');
  if (hEl) hEl.textContent = hours.toString().padStart(2, '0');
  if (mEl) mEl.textContent = minutes.toString().padStart(2, '0');
}

updateTimer();
setInterval(updateTimer, 30000);

// ── ПЛАВАЮЧА КНОПКА ──

var floatBtn = document.getElementById('float-btn');
var scrollThreshold = 400;

function handleScroll() {
  if (!floatBtn) return;
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

// ── UMAMI: ТРЕКІНГ ПЕРЕГЛЯДУ СЕКЦІЙ ──

document.addEventListener("DOMContentLoaded", function () {
  const sectionsToTrack = [
    "hero",
    "gallery",
    "audience",
    "focus",
    "author",
    "program",
    "how-it-works",
    "results",
    "pricing",
    "timer",
    "faq",
    "footer"
  ];

  // Фіксуємо, які секції вже були відправлені за цей візит
  const triggeredSections = {};

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5 // секція вважається видимою, якщо 50% її площі на екрані
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const sectionId = entry.target.id;

      if (entry.isIntersecting && !triggeredSections[sectionId]) {
        // Затримка 1.5 сек — щоб не фіксувати швидке гортання
        setTimeout(() => {
          const freshRecords = observer.takeRecords().find(e => e.target.id === sectionId);
          const stillVisible = freshRecords ? freshRecords.isIntersecting : entry.isIntersecting;

          if (stillVisible && !triggeredSections[sectionId] && window.umami) {
            triggeredSections[sectionId] = true;
            umami.track("Section View", { section_name: sectionId });
            console.log(`Umami → Section View: ${sectionId}`);
          }
        }, 1500);
      }
    });
  }, observerOptions);

  sectionsToTrack.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      observer.observe(el);
    } else {
      console.warn(`Umami: секцію #${id} не знайдено в DOM`);
    }
  });
});
