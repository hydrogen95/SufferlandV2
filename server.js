/* ============================================
   SUFFERLAND - Node.js Backend Server
   Admin Panel API & Static File Server
   ============================================ */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Config file path
const CONFIG_PATH = path.join(__dirname, 'config.json');

// ============================================
// API Routes
// ============================================

// Get current configuration
app.get('/api/config', async (req, res) => {
    try {
        const configData = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        // Remove sensitive data
        const safeConfig = { ...config };
        if (safeConfig.admin) {
            delete safeConfig.admin;
        }
        
        res.json(safeConfig);
    } catch (error) {
        console.error('Error reading config:', error);
        res.status(500).json({ 
            error: 'Failed to read configuration',
            message: error.message 
        });
    }
});

// Update configuration
app.post('/api/config', async (req, res) => {
    try {
        const newConfig = req.body;
        
        // Validate required fields
        if (!newConfig.server || !newConfig.ranks) {
            return res.status(400).json({
                error: 'Invalid configuration',
                message: 'Missing required fields'
            });
        }
        
        // Read existing config to preserve admin credentials
        let existingConfig = {};
        try {
            const existingData = await fs.readFile(CONFIG_PATH, 'utf8');
            existingConfig = JSON.parse(existingData);
        } catch (e) {
            console.log('No existing config found, creating new');
        }
        
        // Merge configs, preserving admin credentials
        const mergedConfig = {
            ...newConfig,
            admin: existingConfig.admin || {
                username: 'admin',
                password: 'sufferland2024'
            }
        };
        
        // Write to file
        await fs.writeFile(
            CONFIG_PATH, 
            JSON.stringify(mergedConfig, null, 2),
            'utf8'
        );
        
        res.json({
            success: true,
            message: 'Configuration saved successfully'
        });
    } catch (error) {
        console.error('Error saving config:', error);
        res.status(500).json({
            error: 'Failed to save configuration',
            message: error.message
        });
    }
});

// Update specific sections
app.post('/api/config/server', async (req, res) => {
    try {
        const serverData = req.body;
        const configData = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        config.server = { ...config.server, ...serverData };
        
        await fs.writeFile(
            CONFIG_PATH,
            JSON.stringify(config, null, 2),
            'utf8'
        );
        
        res.json({ success: true, message: 'Server info updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/config/ranks', async (req, res) => {
    try {
        const ranksData = req.body;
        const configData = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        config.ranks = { ...config.ranks, ...ranksData };
        
        await fs.writeFile(
            CONFIG_PATH,
            JSON.stringify(config, null, 2),
            'utf8'
        );
        
        res.json({ success: true, message: 'Ranks updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/config/discord', async (req, res) => {
    try {
        const discordData = req.body;
        const configData = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        config.discord = { ...config.discord, ...discordData };
        
        await fs.writeFile(
            CONFIG_PATH,
            JSON.stringify(config, null, 2),
            'utf8'
        );
        
        res.json({ success: true, message: 'Discord settings updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin authentication
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const configData = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        if (config.admin && 
            config.admin.username === username && 
            config.admin.password === password) {
            res.json({ 
                success: true, 
                message: 'Login successful',
                token: generateToken()
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update admin credentials
app.post('/api/admin/credentials', async (req, res) => {
    try {
        const { currentPassword, newUsername, newPassword } = req.body;
        const configData = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        // Verify current password
        if (config.admin.password !== currentPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Update credentials
        if (newUsername) config.admin.username = newUsername;
        if (newPassword) config.admin.password = newPassword;
        
        await fs.writeFile(
            CONFIG_PATH,
            JSON.stringify(config, null, 2),
            'utf8'
        );
        
        res.json({ success: true, message: 'Credentials updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Minecraft server status proxy
app.get('/api/server-status', async (req, res) => {
    try {
        const configData = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        const { ip, port } = config.server;
        
        // Forward request to Minecraft status API
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch server status',
            message: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ============================================
// Helper Functions
// ============================================

function generateToken() {
    return 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ============================================
// Error Handling
// ============================================

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ███████╗██╗   ██╗███████╗███████╗███████╗██████╗         ║
║   ██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔══██╗        ║
║   ███████╗██║   ██║█████╗  █████╗  █████╗  ██████╔╝        ║
║   ╚════██║██║   ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗        ║
║   ███████║╚██████╔╝██║     ██║     ███████╗██║  ██║        ║
║   ╚══════╝ ╚═════╝ ╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝        ║
║                                                            ║
║              Server Website Backend                        ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║  Server running on port: ${PORT}                            ║
║  Config file: config.json                                  ║
║  Admin panel: http://localhost:${PORT}/login.html           ║
║  Website: http://localhost:${PORT}/                         ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
