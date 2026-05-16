// ─── LIVE GITHUB INTEGRATION ───
(function () {
  const GITHUB_USERNAME = 'Abhishek543-dotcom';
  const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`;
  const MAX_DISPLAY = 6;

  // Language colors matching GitHub's language colors
  const LANG_COLORS = {
    'Python': '#3572A5',
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Java': '#b07219',
    'Scala': '#c22d40',
    'Shell': '#89e051',
    'HCL': '#844FBA',
    'Dockerfile': '#384d54',
    'Jupyter Notebook': '#DA5B0B',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'SQL': '#e38c00'
  };

  function createSkeletonCards(container) {
    container.innerHTML = '';
    for (let i = 0; i < MAX_DISPLAY; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'github-card skeleton';
      skeleton.innerHTML = `
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-desc"></div>
        <div class="skeleton-line skeleton-desc short"></div>
        <div class="skeleton-meta">
          <div class="skeleton-line skeleton-tag"></div>
          <div class="skeleton-line skeleton-tag"></div>
        </div>
      `;
      container.appendChild(skeleton);
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}yr ago`;
  }

  function renderRepos(repos, container) {
    container.innerHTML = '';

    // Filter out forks, sort by stars then by recent update
    const filtered = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, MAX_DISPLAY);

    if (filtered.length === 0) {
      container.innerHTML = '<p class="github-empty">No public repositories found.</p>';
      return;
    }

    filtered.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'github-card';

      const langColor = LANG_COLORS[repo.language] || '#8b949e';
      const description = repo.description
        ? (repo.description.length > 120 ? repo.description.slice(0, 117) + '...' : repo.description)
        : 'No description provided';

      card.innerHTML = `
        <div class="github-card-header">
          <svg class="github-repo-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8.5V1.5zm-8 11a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="github-card-name">${repo.name}</a>
        </div>
        <p class="github-card-desc">${description}</p>
        <div class="github-card-meta">
          ${repo.language ? `
            <span class="github-lang">
              <span class="lang-dot" style="background:${langColor}"></span>
              ${repo.language}
            </span>
          ` : ''}
          <span class="github-stat">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            ${repo.stargazers_count}
          </span>
          <span class="github-stat">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
            </svg>
            ${repo.forks_count}
          </span>
          <span class="github-updated">Updated ${formatDate(repo.updated_at)}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderFallback(container) {
    container.innerHTML = `
      <div class="github-fallback">
        <p>Unable to load repositories (GitHub API rate limit). Visit my profile directly:</p>
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener" class="btn-ghost">
          View GitHub Profile →
        </a>
      </div>
    `;
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    createSkeletonCards(container);

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        return res.json();
      })
      .then(repos => renderRepos(repos, container))
      .catch(err => {
        console.error('GitHub API error:', err);
        renderFallback(container);
      });
  });
})();
