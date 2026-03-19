/* =============================================
   RICHLOVE SAMUEL SOGLO — Resume Portfolio
   app.js
   ============================================= */

/* ── 1. PARTICLE CANVAS ───────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - .5) * .32;
      this.vy = (Math.random() - .5) * .32;
      this.alpha = Math.random() * .45 + .1;
      const cols = ['rgba(0,229,200,', 'rgba(255,194,74,', 'rgba(255,107,138,'];
      this.col = cols[Math.floor(Math.random() * 3)];
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + this.alpha + ')';
      ctx.fill();
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
  }

  for (let i = 0; i < 110; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 105) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,200,${.055 * (1 - d / 105)})`;
          ctx.lineWidth = .5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── 2. SPA NAVIGATION ─────────────────────────── */
(function initNav() {
  const links     = document.querySelectorAll('.nav-link[data-page]');
  const pages     = document.querySelectorAll('.page');
  const mobileBtn = document.querySelector('.nav-mobile-btn');
  const navLinks  = document.querySelector('.nav-links');

  function showPage(id) {
    pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + id));
    links.forEach(l => l.classList.toggle('active', l.dataset.page === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (navLinks) navLinks.classList.remove('open');
    // restart stats counter when going home
    if (id === 'home') setTimeout(animateStats, 200);
  }

  links.forEach(l => l.addEventListener('click', () => showPage(l.dataset.page)));
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.goto));
  });
  if (mobileBtn) mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

  showPage('home');
})();

/* ── 3. SCROLL PROGRESS BAR ────────────────────── */
(function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

/* ── 4. DARK / LIGHT MODE TOGGLE ───────────────── */
(function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;
  if (!btn) return;

  // restore saved preference
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light');
    btn.textContent = '☀️';
  }

  btn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    btn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
})();

/* ── 5. TYPEWRITER ANIMATION ───────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'IT & Cloud Engineer',
    'DevOps Enthusiast',
    'Azure Certified Pro',
    'Cybersecurity Specialist',
    'IT Systems Administrator',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800); // pause before deleting
        return;
      }
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 600);
})();

/* ── 6. STATS COUNTER ANIMATION ────────────────── */
function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  });
}

/* ── 7. CARD ENTRANCE ANIMATIONS ──────────────── */
// No JS-based reveal — pure CSS handles all entrance animations
// Cards animate in via CSS when their page becomes .active
// This avoids any opacity:0 getting stuck from IntersectionObserver

// Kick off stats on load
window.addEventListener('load', () => {
  setTimeout(animateStats, 500);
});
