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

  // Backend base URL — change this if your server runs on a different host/port.
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
    overview:    ['🏠 Dashboard Overview',      '📆 Tuesday, 8 April 2026 — Good morning!'],
    analytics:   ['📊 Analytics',               'Platform performance & growth metrics'],
    messages:    ['💬 Messages',                '7 unread messages across all channels'],
    calendar:    ['📅 Content Calendar',        'Scheduled posts — week of Apr 7–13'],
    socialposts: ['✍️ Social Posts',            'Manage posts across Instagram, YouTube & Telegram'],
    posts:       ['🖼️ Posts Library',           'Published and draft posts across brands'],
    videos:      ['🎬 Videos',                  'YouTube and Reel content across all channels'],
    campaigns:   ['📢 Campaigns',               'Active and paused marketing campaigns'],
    opo:         ['🏦 OPO Broker',              'Channel stats and recent activity'],
    forfx:       ['📈 ForFX Prop',              'Channel stats and recent activity'],
    reports:     ['📋 Reports',                 'Combined brand performance summary — Apr 2026'],
    settings:    ['⚙️ Settings',               'Account and dashboard preferences'],
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
    if (id === 'socialposts') loadSocialPosts();
  }

  /* ── SOCIAL POSTS ─────────────────────────────────── */
  let spPosts  = [];
  let spEditId = null;

  function spPlatformBadge(platform) {
    const map = { INSTAGRAM: ['badge-ig','IG'], YOUTUBE: ['badge-yt','YT'], TELEGRAM: ['badge-tg','TG'] };
    const [cls, label] = map[platform] || ['', platform];
    return `<span class="post-badge ${cls}">${label}</span>`;
  }

  function spStatusBadge(status) {
    const cls = { DRAFT:'draft', SCHEDULED:'scheduled', PUBLISHED:'published', ARCHIVED:'archived' }[status] || 'draft';
    return `<span class="sp-status sp-status-${cls}">${status}</span>`;
  }

  function spFmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  function spShowBanner(type, msg) {
    const el = document.getElementById('sp-banner');
    el.className = `sp-banner sp-banner-${type}`;
    el.textContent = (type === 'error' ? '⚠️ ' : '✅ ') + msg;
    el.style.display = 'block';
    if (type === 'success') setTimeout(() => { el.style.display = 'none'; }, 3000);
  }

  async function loadSocialPosts() {
    const tbody = document.getElementById('sp-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="sp-loading">Loading posts…</td></tr>';
    try {
      const res = await fetch(API + '/api/social-posts');
      const { success, data, message } = await res.json();
      if (!success) { spShowBanner('error', message); tbody.innerHTML = ''; return; }
      spPosts = data;
      if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="sp-empty">No posts yet — click <strong>+ Add New</strong> to create one.</td></tr>';
        return;
      }
      tbody.innerHTML = data.map(p => `
        <tr>
          <td>${spPlatformBadge(p.platform)}</td>
          <td style="white-space:nowrap;">${p.brand?.name || '—'}</td>
          <td class="sp-col-title" title="${p.title.replace(/"/g,'&quot;')}">${p.title}</td>
          <td>${spStatusBadge(p.status)}</td>
          <td style="white-space:nowrap;font-size:12px;">${spFmtDate(p.scheduledAt)}</td>
          <td style="white-space:nowrap;">
            <button class="sp-btn-edit" onclick="spOpenEdit(${p.id})">Edit</button>
            <button class="sp-btn-del"  onclick="spDelete(${p.id})">Delete</button>
          </td>
        </tr>`).join('');
    } catch {
      spShowBanner('error', 'Cannot reach the server. Is the backend running?');
      tbody.innerHTML = '';
    }
  }

  function spOpenCreate() {
    spEditId = null;
    document.getElementById('sp-modal-title').textContent = '✨ New Social Post';
    document.getElementById('sp-form').reset();
    document.getElementById('sp-modal-error').style.display = 'none';
    document.getElementById('sp-modal-overlay').classList.add('open');
  }

  function spOpenEdit(id) {
    const post = spPosts.find(p => p.id === id);
    if (!post) return;
    spEditId = id;
    document.getElementById('sp-modal-title').textContent = '✏️ Edit Post';
    document.getElementById('sp-modal-error').style.display = 'none';
    document.getElementById('sp-f-platform').value  = post.platform;
    document.getElementById('sp-f-brand').value     = post.brandId;
    document.getElementById('sp-f-title').value     = post.title;
    document.getElementById('sp-f-content').value   = post.content || '';
    document.getElementById('sp-f-status').value    = post.status;
    document.getElementById('sp-f-scheduled').value = post.scheduledAt ? post.scheduledAt.slice(0,16) : '';
    document.getElementById('sp-modal-overlay').classList.add('open');
  }

  function spCloseModal() {
    document.getElementById('sp-modal-overlay').classList.remove('open');
    spEditId = null;
  }

  async function spSubmit() {
    const platform  = document.getElementById('sp-f-platform').value;
    const brandId   = document.getElementById('sp-f-brand').value;
    const title     = document.getElementById('sp-f-title').value.trim();
    const content   = document.getElementById('sp-f-content').value.trim();
    const status    = document.getElementById('sp-f-status').value;
    const scheduled = document.getElementById('sp-f-scheduled').value;
    const errEl     = document.getElementById('sp-modal-error');
    errEl.style.display = 'none';

    if (!platform) { errEl.textContent = '⚠️ Platform is required'; errEl.style.display = 'block'; return; }
    if (!brandId)  { errEl.textContent = '⚠️ Brand is required';    errEl.style.display = 'block'; return; }
    if (!title)    { errEl.textContent = '⚠️ Title is required';    errEl.style.display = 'block'; return; }

    const body = { platform, brandId: Number(brandId), title, content: content || null, status };
    if (scheduled) body.scheduledAt = new Date(scheduled).toISOString();

    const isEdit = spEditId !== null;
    const url    = API + '/api/social-posts' + (isEdit ? '/' + spEditId : '');
    const method = isEdit ? 'PUT' : 'POST';

    const btn = document.getElementById('sp-submit-btn');
    btn.disabled = true; btn.textContent = 'Saving…';

    try {
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const { success, message } = await res.json();
      if (!success) { errEl.textContent = '⚠️ ' + message; errEl.style.display = 'block'; return; }
      spCloseModal();
      spShowBanner('success', isEdit ? 'Post updated.' : 'Post created.');
      loadSocialPosts();
    } catch {
      errEl.textContent = '⚠️ Cannot reach the server. Is the backend running?';
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false; btn.textContent = 'Save Post';
    }
  }

  async function spDelete(id) {
    const post  = spPosts.find(p => p.id === id);
    const label = post ? post.title : 'this post';
    if (!confirm(`Delete "${label}"?\n\nThis cannot be undone.`)) return;
    try {
      const res  = await fetch(API + '/api/social-posts/' + id, { method: 'DELETE' });
      const { success, message } = await res.json();
      if (!success) { spShowBanner('error', message); return; }
      spShowBanner('success', 'Post deleted.');
      loadSocialPosts();
    } catch {
      spShowBanner('error', 'Cannot reach the server. Is the backend running?');
    }
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
