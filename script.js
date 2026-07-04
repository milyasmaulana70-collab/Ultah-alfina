// ====== DATA UTAMA (ubah di sini jika perlu) ======
const BIRTH_DATE = new Date(2006, 6, 17); // 17 Juli 2006 (bulan mulai dari 0)
// ===================================================

// ---------- Umur berjalan naik ----------
function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const targetAge = calculateAge(BIRTH_DATE);

function animateAge(target) {
  const el = document.getElementById('ageNumber');
  const duration = 1600;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(tick);
}

window.addEventListener('load', () => {
  setTimeout(() => animateAge(targetAge), 900);
});

// ---------- Countdown ke ulang tahun berikutnya ----------
function getNextBirthday(birthDate) {
  const today = new Date();
  let next = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  return next;
}

function updateCountdown() {
  const next = getNextBirthday(BIRTH_DATE);
  const now = new Date();
  const diff = next - now;

  if (diff <= 0) {
    document.getElementById('countdownGrid').innerHTML =
      '<div class="countdown-done">Selamat merayakan hari ini! 🎉</div>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- Carousel foto (auto-play bergantian) ----------
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');
const slides = track ? track.querySelectorAll('.carousel-slide') : [];
let currentSlide = 0;
let carouselTimer = null;

function buildDots() {
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
}

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  goToSlide(next);
}

function startCarousel() {
  carouselTimer = setInterval(nextSlide, 3500);
}

if (slides.length > 0) {
  buildDots();
  startCarousel();
}

// ---------- Musik latar (autoplay dengan fallback) ----------
const bgMusic = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
let musicPlaying = false;

function updateSoundIcon() {
  soundIcon.textContent = musicPlaying ? '🔊' : '🔇';
}

function tryAutoplay() {
  bgMusic.volume = 0.5;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        musicPlaying = true;
        updateSoundIcon();
      })
      .catch(() => {
        // Autoplay diblokir browser, tunggu klik pertama user
        musicPlaying = false;
        updateSoundIcon();
        const resumeOnInteract = () => {
          bgMusic.play().then(() => {
            musicPlaying = true;
            updateSoundIcon();
          }).catch(() => {});
          document.removeEventListener('click', resumeOnInteract);
        };
        document.addEventListener('click', resumeOnInteract, { once: true });
      });
  }
}

soundToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
  } else {
    bgMusic.play().then(() => { musicPlaying = true; }).catch(() => {});
  }
  updateSoundIcon();
});

window.addEventListener('load', () => {
  tryAutoplay();
});

// ---------- Sparkle ambient effect ----------
function createSparkle() {
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = Math.random() * 100 + 'vw';
  s.style.animationDuration = (6 + Math.random() * 6) + 's';
  s.style.bottom = '-10px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 13000);
}
setInterval(createSparkle, 900);
