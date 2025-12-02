const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files only for authenticated users
app.use((req, res, next) => {
    // Allow access to login page and auth endpoints
    if (req.path === '/login.html' || req.path === '/api/login' || req.path === '/api/check-auth') {
        return next();
    }
    
    // Check authentication for all other requests
    if (!req.session.authenticated) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.redirect('/login.html');
    }
    next();
});

app.use(express.static(path.join(__dirname)));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'appliances.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Create default appliances file if it doesn't exist
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
    
    // Create users file if it doesn't exist
    try {
        await fs.access(USERS_FILE);
    } catch {
        // Create default user: username "admin", password "admin" (change this!)
        const hashedPassword = await bcrypt.hash('admin', 10);
        const defaultUser = {
            username: 'admin',
            password: hashedPassword
        };
        await fs.writeFile(USERS_FILE, JSON.stringify(defaultUser, null, 2));
    }
}

// Authentication endpoints
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const userData = await fs.readFile(USERS_FILE, 'utf8');
        const user = JSON.parse(userData);
        
        if (username === user.username) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.authenticated = true;
                req.session.username = username;
                return res.json({ success: true });
            }
        }
        
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/check-auth', (req, res) => {
    res.json({ authenticated: !!req.session.authenticated });
});

// Appliance data endpoints
app.get('/api/appliances', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading appliances:', error);
        res.status(500).json({ error: 'Failed to load appliances' });
    }
});

app.post('/api/appliances', async (req, res) => {
    try {
        const appliances = req.body;
        await fs.writeFile(DATA_FILE, JSON.stringify(appliances, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving appliances:', error);
        res.status(500).json({ error: 'Failed to save appliances' });
    }
});

// Root redirect
app.get('/', (req, res) => {
    if (req.session.authenticated) {
        res.redirect('/kitchen.html');
    } else {
        res.redirect('/login.html');
    }
});

// Start server
ensureDataDirectory().then(() => {
    app.listen(PORT, () => {
        console.log(`Kitchen Tracker server running on http://localhost:${PORT}`);
        console.log('Default credentials: username=admin, password=admin');
        console.log('IMPORTANT: Change the default password after first login!');
    });
});
