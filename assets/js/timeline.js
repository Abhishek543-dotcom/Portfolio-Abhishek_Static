// ─── DYNAMIC CAREER TIMELINE ───
(function () {
  const CAREER_DATA_URL = 'assets/data/career.json';

  async function loadCareerData() {
    try {
      const res = await fetch(CAREER_DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to load career data:', err);
      return null;
    }
  }

  function renderTimeline(data) {
    const container = document.getElementById('timeline-container');
    if (!container || !data) return;

    container.innerHTML = '';

    data.timeline.forEach((job, index) => {
      const item = document.createElement('div');
      item.className = 'exp-item';
      item.style.animationDelay = `${index * 0.1}s`;

      const skillTags = job.skills
        .map(s => `<span class="exp-skill-tag">${s}</span>`)
        .join('');

      const bullets = job.highlights
        .map(h => `<li>${h}</li>`)
        .join('');

      item.innerHTML = `
        <div class="exp-header">
          <span class="exp-company">${job.company}</span>
          <span class="exp-period">${job.period}</span>
        </div>
        <div class="exp-role">${job.role} · ${job.location}</div>
        <div class="exp-skills">${skillTags}</div>
        <div class="exp-expand-toggle" aria-label="Toggle details">
          <span class="exp-metric-badge">${job.metrics.label}</span>
          <span class="exp-toggle-icon">▼</span>
        </div>
        <ul class="exp-bullets">${bullets}</ul>
      `;

      // Click to expand/collapse
      const toggle = item.querySelector('.exp-expand-toggle');
      const bulletList = item.querySelector('.exp-bullets');
      bulletList.classList.add('collapsed');

      toggle.addEventListener('click', () => {
        bulletList.classList.toggle('collapsed');
        const icon = toggle.querySelector('.exp-toggle-icon');
        icon.textContent = bulletList.classList.contains('collapsed') ? '▼' : '▲';
      });

      container.appendChild(item);
    });

    // Re-observe for scroll reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    container.querySelectorAll('.exp-item').forEach(el => observer.observe(el));
  }

  function renderOffers(data) {
    const container = document.getElementById('offers-container');
    if (!container || !data) return;

    container.innerHTML = '';

    data.offers.forEach(offer => {
      const card = document.createElement('div');
      card.className = 'offer-card';
      card.innerHTML = `
        <div class="offer-company">${offer.company}</div>
        <div class="offer-year">${offer.year}</div>
      `;
      container.appendChild(card);
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadCareerData();
    if (data) {
      renderTimeline(data);
      renderOffers(data);
    }
  });
})();
