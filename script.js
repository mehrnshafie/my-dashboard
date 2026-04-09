  /* ── THEME ─────────────────────────────────────────── */
  function applyTheme(theme) {
    const html = document.documentElement;
    // Enable transitions for this switch only
    html.classList.add('theme-switching');
    setTimeout(() => html.classList.remove('theme-switching'), 350);

    html.setAttribute('data-theme', theme);
    localStorage.setItem('opo-theme', theme);

    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function initTheme() {
    // Default is dark; respect saved preference
    const saved = localStorage.getItem('opo-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  }

  /* ── SCREENS ────────────────────────────────────────── */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function setUserUI(name) {
    const initial = name.trim().charAt(0).toUpperCase();
    ['headerInitial','sidebarInitial'].forEach(id => document.getElementById(id).textContent = initial);
    ['headerName','sidebarName'].forEach(id => document.getElementById(id).textContent = name);
  }

  function doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;
    const err   = document.getElementById('loginError');
    if (!email || !pass) { err.style.display = 'block'; return; }
    err.style.display = 'none';
    const name = email.includes('@')
      ? email.split('@')[0].replace(/[._-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
      : email;
    setUserUI(name);
    showScreen('dashScreen');
  }

  function doSignup() {
    const name  = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass  = document.getElementById('signupPass').value;
    const pass2 = document.getElementById('signupPass2').value;
    const err   = document.getElementById('signupError');
    if (!name || !email || !pass || !pass2) {
      err.style.display = 'block'; err.textContent = '⚠️ Please fill in all fields.'; return;
    }
    if (pass !== pass2) {
      err.style.display = 'block'; err.textContent = '⚠️ Passwords do not match.'; return;
    }
    err.style.display = 'none';
    setUserUI(name);
    showScreen('dashScreen');
  }

  function doLogout() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value  = '';
    showScreen('loginScreen');
  }

  /* ── PAGE ROUTING ───────────────────────────────── */
  const PAGE_META = {
    overview:  ['🏠 Dashboard Overview',      '📆 Tuesday, 8 April 2026 — Good morning!'],
    analytics: ['📊 Analytics',               'Platform performance & growth metrics'],
    messages:  ['💬 Messages',                '7 unread messages across all channels'],
    calendar:  ['📅 Content Calendar',        'Scheduled posts — week of Apr 7–13'],
    posts:     ['🖼️ Posts Library',           'Published and draft posts across brands'],
    videos:    ['🎬 Videos',                  'YouTube and Reel content across all channels'],
    campaigns: ['📢 Campaigns',               'Active and paused marketing campaigns'],
    opo:       ['🏦 OPO Broker',              'Channel stats and recent activity'],
    forfx:     ['📈 ForFX Prop',              'Channel stats and recent activity'],
    reports:   ['📋 Reports',                 'Combined brand performance summary — Apr 2026'],
    settings:  ['⚙️ Settings',               'Account and dashboard preferences'],
  };

  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById('page-' + id);
    if (pg) pg.classList.add('active');
    const meta = PAGE_META[id] || ['Dashboard', ''];
    const titleEl = document.querySelector('.header-title');
    const subEl   = document.querySelector('.header-sub');
    if (titleEl) titleEl.textContent = meta[0];
    if (subEl)   subEl.textContent   = meta[1];
  }

  function setNav(el) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    const page = el.dataset.page;
    if (page) showPage(page);
  }

  // Called by "Full report →" links inside page bodies
  function navToPage(el) {
    const page = el.dataset.page;
    if (!page) return;
    const navItem = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (navItem) setNav(navItem);
  }

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (document.getElementById('loginScreen').classList.contains('active'))  doLogin();
    if (document.getElementById('signupScreen').classList.contains('active')) doSignup();
  });

  // Init theme on load (syncs button icon with saved preference)
  document.addEventListener('DOMContentLoaded', initTheme);
