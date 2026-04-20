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

  const API = 'http://localhost:3001';

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

  function setLoading(btnId, loading, defaultText) {
    const btn = document.getElementById(btnId);
    btn.disabled = loading;
    btn.textContent = loading ? 'Please wait…' : defaultText;
  }

  function showError(errEl, msg) {
    errEl.textContent = '⚠️ ' + msg;
    errEl.style.display = 'block';
  }

  async function doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;
    const err   = document.getElementById('loginError');
    err.style.display = 'none';

    if (!email || !pass) { showError(err, 'Please enter your email and password.'); return; }

    setLoading('loginBtn', true, 'Sign In →');
    try {
      const res  = await fetch(API + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) { showError(err, data.error || 'Login failed.'); return; }
      setUserUI(data.name);
      showScreen('dashScreen');
    } catch {
      showError(err, 'Cannot reach the server. Is the backend running?');
    } finally {
      setLoading('loginBtn', false, 'Sign In →');
    }
  }

  async function doSignup() {
    const name  = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass  = document.getElementById('signupPass').value;
    const pass2 = document.getElementById('signupPass2').value;
    const role  = document.getElementById('signupRole').value;
    const err     = document.getElementById('signupError');
    const success = document.getElementById('signupSuccess');
    err.style.display = 'none';
    success.style.display = 'none';

    if (!name || !email || !pass || !pass2 || !role) {
      showError(err, 'Please fill in all fields.'); return;
    }
    if (pass !== pass2) {
      showError(err, 'Passwords do not match.'); return;
    }

    setLoading('signupBtn', true, 'Create Account →');
    try {
      const res  = await fetch(API + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role }),
      });
      const data = await res.json();
      if (!res.ok) { showError(err, data.error || 'Registration failed.'); return; }
      success.style.display = 'block';
      setTimeout(() => {
        success.style.display = 'none';
        document.getElementById('signupName').value  = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPass').value  = '';
        document.getElementById('signupPass2').value = '';
        document.getElementById('signupRole').value  = '';
        showScreen('loginScreen');
      }, 2000);
    } catch {
      showError(err, 'Cannot reach the server. Is the backend running?');
    } finally {
      setLoading('signupBtn', false, 'Create Account →');
    }
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
