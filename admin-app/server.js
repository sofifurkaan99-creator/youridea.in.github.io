const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = 'youridea-secret-key';
const DATA_PATH = path.join(__dirname, 'data', 'store.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_PATH)) {
    const defaultStore = {
      adminUser: {
        username: 'admin',
        password: 'admin123'
      },
      overview: {
        totalProjects: 50,
        activeClients: 12,
        responseTime: '24h',
        salesThisMonth: '₹1.8L'
      },
      projects: [
        {
          id: 1,
          title: 'Luxury Retail Experience',
          client: 'Northstar Studio',
          status: 'Live',
          value: '₹85,000',
          progress: 92,
          date: '2026-10-10'
        },
        {
          id: 2,
          title: 'Hospitality Brand Launch',
          client: 'Luma Stay',
          status: 'In Progress',
          value: '₹1,20,000',
          progress: 76,
          date: '2026-10-17'
        },
        {
          id: 3,
          title: 'Startup Growth Funnel',
          client: 'PeakWorks',
          status: 'Proposal',
          value: '₹65,000',
          progress: 42,
          date: '2026-10-25'
        }
      ],
      enquiries: [
        {
          id: 1,
          name: 'Aarav Mehta',
          email: 'aarav@northstar.com',
          company: 'Northstar Studio',
          message: 'Need a premium brand site with stronger digital positioning.',
          status: 'New'
        },
        {
          id: 2,
          name: 'Sana Qureshi',
          email: 'sana@studiolane.co',
          company: 'Studio Lane',
          message: 'Looking for a modern landing page and brand redesign.',
          status: 'Contacted'
        }
      ],
      services: [
        { id: 1, name: 'Brand Strategy', description: 'Positioning and voice for premium business growth.', price: '₹25,000' },
        { id: 2, name: 'Website Design', description: 'Responsive, premium digital experiences for business websites.', price: '₹45,000' },
        { id: 3, name: 'Growth Funnel', description: 'Lead capture and conversion-focused landing pages.', price: '₹60,000' }
      ],
      pricing: [
        { id: 1, tier: 'Starter', price: '₹3,999', description: 'Business website essentials' },
        { id: 2, tier: 'Growth', price: '₹7,999', description: 'Premium brand and landing pages' },
        { id: 3, tier: 'Premium', price: '₹14,999', description: 'Advanced custom digital platform' }
      ]
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(defaultStore, null, 2));
  }
}

function readStore() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function writeStore(store) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const store = readStore();

  if (username === store.adminUser.username && password === store.adminUser.password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { username } });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
});

app.get('/api/overview', authenticate, (req, res) => {
  const store = readStore();
  res.json(store.overview);
});

app.get('/api/projects', authenticate, (req, res) => {
  const store = readStore();
  res.json(store.projects);
});

app.post('/api/projects', authenticate, (req, res) => {
  const store = readStore();
  const { title, client, status, value, progress } = req.body || {};

  if (!title || !client) {
    return res.status(400).json({ message: 'Title and client are required.' });
  }

  const newProject = {
    id: Date.now(),
    title,
    client,
    status: status || 'New',
    value: value || '₹0',
    progress: Number(progress) || 0,
    date: new Date().toISOString().split('T')[0]
  };

  store.projects.unshift(newProject);
  writeStore(store);
  res.status(201).json(newProject);
});

app.get('/api/enquiries', authenticate, (req, res) => {
  const store = readStore();
  res.json(store.enquiries);
});

app.post('/api/enquiries', authenticate, (req, res) => {
  const store = readStore();
  const { name, email, company, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }

  const newEnquiry = {
    id: Date.now(),
    name,
    email,
    company: company || 'Not provided',
    message,
    status: 'New'
  };

  store.enquiries.unshift(newEnquiry);
  writeStore(store);
  res.status(201).json(newEnquiry);
});

app.get('/api/services', authenticate, (req, res) => {
  const store = readStore();
  res.json(store.services);
});

app.get('/api/pricing', authenticate, (req, res) => {
  const store = readStore();
  res.json(store.pricing);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`youridea admin running at http://localhost:${PORT}`);
});
