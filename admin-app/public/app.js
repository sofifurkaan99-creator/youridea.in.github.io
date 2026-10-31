const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const statsGrid = document.getElementById('stats-grid');
const projectsBody = document.getElementById('projects-body');
const enquiriesList = document.getElementById('enquiries-list');
const servicesList = document.getElementById('services-list');
const pricingList = document.getElementById('pricing-list');
const projectForm = document.getElementById('project-form');
const toggleProjectForm = document.getElementById('toggle-project-form');

const tokenKey = 'youridea-admin-token';

function setAuthToken(token) {
  if (token) {
    localStorage.setItem(tokenKey, token);
  } else {
    localStorage.removeItem(tokenKey);
  }
}

function getAuthToken() {
  return localStorage.getItem(tokenKey);
}

function apiFetch(url, options = {}) {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  });
}

function renderStats(overview) {
  const cards = [
    { label: 'Projects', value: overview.totalProjects },
    { label: 'Clients', value: overview.activeClients },
    { label: 'Response', value: overview.responseTime },
    { label: 'Sales', value: overview.salesThisMonth }
  ];

  statsGrid.innerHTML = cards.map(card => `
    <div class="stat-card">
      <span class="label">${card.label}</span>
      <strong>${card.value}</strong>
    </div>
  `).join('');
}

function getStatusClass(status) {
  const map = {
    Live: 'live',
    'In Progress': 'progress',
    Proposal: 'proposal',
    New: 'new',
    Contacted: 'progress',
    'Not provided': 'new'
  };
  return map[status] || 'new';
}

function renderProjects(projects) {
  if (!projects.length) {
    projectsBody.innerHTML = '<tr><td colspan="5">No projects yet.</td></tr>';
    return;
  }

  projectsBody.innerHTML = projects.map(project => `
    <tr>
      <td><strong>${project.title}</strong></td>
      <td>${project.client}</td>
      <td><span class="badge ${getStatusClass(project.status)}">${project.status}</span></td>
      <td>${project.value || '—'}</td>
      <td>
        <div class="progress-bar"><span style="width:${project.progress || 0}%"></span></div>
      </td>
    </tr>
  `).join('');
}

function renderEnquiries(enquiries) {
  enquiriesList.innerHTML = enquiries.map(enquiry => `
    <div class="enquiry-card">
      <strong>${enquiry.name}</strong>
      <p>${enquiry.message}</p>
      <small>${enquiry.email} · ${enquiry.company} · <span class="badge ${getStatusClass(enquiry.status)}">${enquiry.status}</span></small>
    </div>
  `).join('');
}

function renderServices(services) {
  servicesList.innerHTML = services.map(service => `
    <div class="service-chip">
      <strong>${service.name}</strong>
      <p>${service.description}</p>
    </div>
  `).join('');
}

function renderPricing(pricing) {
  pricingList.innerHTML = pricing.map(item => `
    <div class="price-card">
      <div>
        <strong>${item.tier}</strong>
        <p>${item.description}</p>
      </div>
      <span class="price-tag">${item.price}</span>
    </div>
  `).join('');
}

async function loadDashboard() {
  const [overview, projects, enquiries, services, pricing] = await Promise.all([
    apiFetch('/api/overview'),
    apiFetch('/api/projects'),
    apiFetch('/api/enquiries'),
    apiFetch('/api/services'),
    apiFetch('/api/pricing')
  ]);

  renderStats(overview);
  renderProjects(projects);
  renderEnquiries(enquiries);
  renderServices(services);
  renderPricing(pricing);
}

async function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const result = await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    setAuthToken(result.token);
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    await loadDashboard();
  } catch (error) {
    alert(error.message || 'Login failed');
  }
}

function logout() {
  setAuthToken(null);
  loginScreen.classList.add('active');
  dashboardScreen.classList.remove('active');
  document.getElementById('password').value = '';
}

async function createProject(event) {
  event.preventDefault();
  const payload = {
    title: document.getElementById('project-title').value.trim(),
    client: document.getElementById('project-client').value.trim(),
    value: document.getElementById('project-value').value.trim(),
    progress: document.getElementById('project-progress').value,
    status: document.getElementById('project-status').value
  };

  try {
    await apiFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    projectForm.reset();
    projectForm.classList.add('hidden');
    await loadDashboard();
  } catch (error) {
    alert(error.message || 'Failed to add project');
  }
}

function init() {
  const token = getAuthToken();
  if (token) {
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    loadDashboard().catch(() => logout());
  } else {
    loginScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
  }
}

loginForm.addEventListener('submit', login);
logoutBtn.addEventListener('click', logout);
projectForm.addEventListener('submit', createProject);
toggleProjectForm.addEventListener('click', () => {
  projectForm.classList.toggle('hidden');
});

init();
