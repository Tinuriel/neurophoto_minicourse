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
