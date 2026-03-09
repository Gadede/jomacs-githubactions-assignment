// ==============================
// RICHY — DevOps Site JS
// Dynamic date, particles, effects
// ==============================

// --- Deployment Date/Time (system-generated) ---
function setDeploymentDate() {
  const now = new Date();

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };

  const formattedDate = now.toLocaleDateString('en-US', dateOptions);
  const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

  const deployDateEl = document.getElementById('deploy-date');
  const deployTimeEl = document.getElementById('deploy-time');
  const footerDateEl = document.getElementById('footer-date');
  const yearEl = document.getElementById('year');

  if (deployDateEl) deployDateEl.textContent = formattedDate;
  if (deployTimeEl) deployTimeEl.textContent = formattedTime;
  if (footerDateEl) footerDateEl.textContent = formattedDate;
  if (yearEl) yearEl.textContent = now.getFullYear();
}

// --- Particle System ---
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#00d4ff', '#00ff88', '#ffaa00'];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 20;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;

    container.appendChild(p);
  }
}

// --- Typing effect for terminal (re-trigger on scroll) ---
function initTerminalTyping() {
  const lines = document.querySelectorAll('.t-line');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach(line => {
          line.style.animationPlayState = 'running';
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const terminal = document.querySelector('.terminal-block');
  if (terminal) observer.observe(terminal);
}

// --- Scroll reveal for cards ---
function initScrollReveal() {
  const cards = document.querySelectorAll('.tool-card, .pipe-step, .deploy-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}

// --- Live clock tick ---
function startLiveClock() {
  setInterval(() => {
    const deployTimeEl = document.getElementById('deploy-time');
    if (deployTimeEl) {
      const now = new Date();
      deployTimeEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    }
  }, 1000);
}

// --- Glitch effect on hero title ---
function initGlitch() {
  const title = document.querySelector('.line2');
  if (!title) return;

  setInterval(() => {
    if (Math.random() > 0.92) {
      title.style.transform = `skewX(${(Math.random() - 0.5) * 4}deg)`;
      title.style.filter = `drop-shadow(${(Math.random()-0.5)*6}px 0 8px #00d4ff)`;
      setTimeout(() => {
        title.style.transform = '';
        title.style.filter = '';
      }, 80);
    }
  }, 600);
}

// --- Pipeline step highlight ---
function animatePipeline() {
  const steps = document.querySelectorAll('.pipe-step');
  if (!steps.length) return;

  let current = 0;
  const interval = setInterval(() => {
    steps.forEach(s => s.classList.remove('active'));
    steps[current].classList.add('active');
    current = (current + 1) % steps.length;
  }, 1200);

  // Stop after full cycle and keep last step (LIVE) active
  setTimeout(() => {
    clearInterval(interval);
    steps.forEach(s => s.classList.remove('active'));
    steps[steps.length - 1].classList.add('active');
  }, 1200 * (steps.length + 1));
}

// --- Init everything ---
document.addEventListener('DOMContentLoaded', () => {
  setDeploymentDate();
  createParticles();
  initScrollReveal();
  initGlitch();
  startLiveClock();

  // Delay pipeline animation until visible
  const pipeSection = document.querySelector('.pipeline-section');
  if (pipeSection) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animatePipeline();
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(pipeSection);
  }

  // Smooth nav active state
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--green)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));
});
