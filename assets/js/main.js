// ─── MAIN APP ───

// ─── TYPEWRITER EFFECT ───
const phrases = [
  'Designing Lakehouse architectures at petabyte scale.',
  'Building real-time Kafka + Spark streaming pipelines.',
  'Migrating legacy DWH to Apache Iceberg Lakehouses.',
  'Shipping GenAI RAG pipelines for enterprise search.',
  'Optimizing PySpark jobs for financial data at JPMC.',
];
let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ci++);
    if (ci > phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    tw.textContent = phrase.slice(0, ci--);
    if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
  }
  setTimeout(type, deleting ? 30 : 55);
}
type();

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.exp-item, .skill-card, .project-card, .github-card, .insight-card, .offer-card').forEach(el => observer.observe(el));

// ─── MOBILE NAV TOGGLE ───
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-open');
    navToggle.classList.toggle('active');
  });

  // Close menu on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav-open');
      navToggle.classList.remove('active');
    });
  });
}

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── FEATURED INSIGHTS RENDERER ───
(function () {
  async function loadInsights() {
    try {
      const res = await fetch('assets/data/career.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderInsights(data.insights);
    } catch (err) {
      console.error('Failed to load insights:', err);
    }
  }

  function renderInsights(insights) {
    const container = document.getElementById('insights-container');
    if (!container || !insights) return;

    container.innerHTML = '';

    insights.forEach(post => {
      const card = document.createElement('div');
      card.className = 'insight-card';

      const tags = post.tags
        .map(t => `<span class="insight-tag">${t}</span>`)
        .join('');

      const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      card.innerHTML = `
        <div class="insight-date">${date}</div>
        <h3 class="insight-title">${post.title}</h3>
        <p class="insight-summary">${post.summary}</p>
        <div class="insight-tags">${tags}</div>
        <a href="${post.url}" target="_blank" rel="noopener" class="insight-link">
          Read on LinkedIn →
        </a>
      `;
      container.appendChild(card);
    });

    // Observe for scroll reveal
    container.querySelectorAll('.insight-card').forEach(el => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', loadInsights);
})();
