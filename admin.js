/* ============================================
   SUFFERLAND - Admin Panel JavaScript
   Auto-save Configuration
   ============================================ */

// Global config object
let currentConfig = {};

// Check if logged in
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('sufferland_admin_logged_in') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Set username
    const username = sessionStorage.getItem('sufferland_admin_user') || 'Admin';
    document.getElementById('admin-username').textContent = username;
    
    // Initialize
    loadConfig();
    initNavigation();
    initMobileToggle();
    initLogout();
});

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            
            // Update active nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // Show section
            showSection(section);
            
            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('open');
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Special handling for preview section
    if (sectionName === 'preview') {
        loadConfigPreview();
    }
}

function initMobileToggle() {
    const toggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('sufferland_admin_logged_in');
        sessionStorage.removeItem('sufferland_admin_user');
        window.location.href = 'login.html';
    });
}

// ============================================
// Config Management
// ============================================

async function loadConfig() {
    try {
        // Try to load from localStorage first (for auto-saved config)
        const savedConfig = localStorage.getItem('sufferland_config');
        if (savedConfig) {
            currentConfig = JSON.parse(savedConfig);
            console.log('Config loaded from localStorage');
        } else {
            // Load from config.json file
            const response = await fetch('config.json');
            currentConfig = await response.json();
            console.log('Config loaded from file');
        }
        
        // Populate form fields
        populateServerInfo();
        populateRanks();
        populateDiscord();
    } catch (error) {
        console.error('Failed to load config:', error);
        showStatus('Failed to load configuration', 'error');
    }
}

function populateServerInfo() {
    if (!currentConfig.server) return;
    
    document.getElementById('server-name').value = currentConfig.server.name || '';
    document.getElementById('server-ip').value = currentConfig.server.ip || '';
    document.getElementById('server-port').value = currentConfig.server.port || '';
    document.getElementById('server-tagline').value = currentConfig.server.tagline || '';
    document.getElementById('server-description').value = currentConfig.server.description || '';
    document.getElementById('server-full-desc').value = currentConfig.server.fullDescription || '';
}

function populateRanks() {
    if (!currentConfig.ranks) return;
    
    const rankIds = ['vip', 'mvp', 'elite', 'giant', 'titan'];
    
    rankIds.forEach(rankId => {
        const rank = currentConfig.ranks[rankId];
        if (!rank) return;
        
        // Set name and price
        const nameInput = document.getElementById(`${rankId}-name`);
        const priceInput = document.getElementById(`${rankId}-price`);
        
        if (nameInput) nameInput.value = rank.name || '';
        if (priceInput) priceInput.value = rank.price || 0;
        
        // Set perks
        renderPerks(rankId, rank.perks || []);
    });
}

function renderPerks(rankId, perks) {
    const perksList = document.getElementById(`${rankId}-perks-list`);
    if (!perksList) return;
    
    perksList.innerHTML = perks.map((perk, index) => `
        <div class="perk-item">
            <input type="text" value="${escapeHtml(perk)}" data-index="${index}">
            <button type="button" class="perk-remove" onclick="removePerk('${rankId}', ${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function addPerk(rankId) {
    const perksList = document.getElementById(`${rankId}-perks-list`);
    if (!perksList) return;
    
    const perkItems = perksList.querySelectorAll('.perk-item');
    const newIndex = perkItems.length;
    
    const perkDiv = document.createElement('div');
    perkDiv.className = 'perk-item';
    perkDiv.innerHTML = `
        <input type="text" value="" placeholder="Enter perk description" data-index="${newIndex}">
        <button type="button" class="perk-remove" onclick="removePerk('${rankId}', ${newIndex})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    perksList.appendChild(perkDiv);
}

function removePerk(rankId, index) {
    const perksList = document.getElementById(`${rankId}-perks-list`);
    if (!perksList) return;
    
    const perkItems = perksList.querySelectorAll('.perk-item');
    if (perkItems[index]) {
        perkItems[index].remove();
    }
    
    // Reindex remaining perks
    const remainingItems = perksList.querySelectorAll('.perk-item');
    remainingItems.forEach((item, i) => {
        const input = item.querySelector('input');
        const button = item.querySelector('button');
        if (input) input.dataset.index = i;
        if (button) button.setAttribute('onclick', `removePerk('${rankId}', ${i})`);
    });
}

function getPerksFromForm(rankId) {
    const perksList = document.getElementById(`${rankId}-perks-list`);
    if (!perksList) return [];
    
    const inputs = perksList.querySelectorAll('input');
    return Array.from(inputs)
        .map(input => input.value.trim())
        .filter(value => value !== '');
}

function populateDiscord() {
    if (!currentConfig.discord) return;
    
    const discordLink = document.getElementById('discord-link');
    if (discordLink) {
        discordLink.value = currentConfig.discord.link || '';
    }
}

// ============================================
// Auto-Save Functions - ONE CLICK SAVE
// ============================================

function saveServerInfo() {
    // Show loading
    showStatus('Saving server information...', 'loading');
    
    // Update config
    currentConfig.server = {
        name: document.getElementById('server-name').value,
        ip: document.getElementById('server-ip').value,
        port: document.getElementById('server-port').value,
        tagline: document.getElementById('server-tagline').value,
        description: document.getElementById('server-description').value,
        fullDescription: document.getElementById('server-full-desc').value
    };
    
    // Save automatically
    autoSaveConfig('Server information saved successfully!');
}

function saveRanks() {
    // Show loading
    showStatus('Saving ranks...', 'loading');
    
    const rankIds = ['vip', 'mvp', 'elite', 'giant', 'titan'];
    
    rankIds.forEach(rankId => {
        const nameInput = document.getElementById(`${rankId}-name`);
        const priceInput = document.getElementById(`${rankId}-price`);
        
        if (nameInput && priceInput) {
            currentConfig.ranks[rankId] = {
                name: nameInput.value,
                price: parseInt(priceInput.value) || 0,
                perks: getPerksFromForm(rankId)
            };
        }
    });
    
    // Save automatically
    autoSaveConfig('All ranks saved successfully!');
}

function saveDiscord() {
    // Show loading
    showStatus('Saving Discord settings...', 'loading');
    
    currentConfig.discord = {
        link: document.getElementById('discord-link').value
    };
    
    // Save automatically
    autoSaveConfig('Discord settings saved successfully!');
}

function saveSettings() {
    const newUsername = document.getElementById('admin-username-new').value.trim();
    const newPassword = document.getElementById('admin-password-new').value;
    const confirmPassword = document.getElementById('admin-password-confirm').value;
    
    if (newPassword || newUsername) {
        if (newPassword && newPassword !== confirmPassword) {
            showStatus('Passwords do not match!', 'error');
            return;
        }
        
        // Show loading
        showStatus('Saving admin settings...', 'loading');
        
        if (newUsername) {
            currentConfig.admin.username = newUsername;
        }
        
        if (newPassword) {
            currentConfig.admin.password = newPassword;
        }
        
        // Clear fields
        document.getElementById('admin-username-new').value = '';
        document.getElementById('admin-password-new').value = '';
        document.getElementById('admin-password-confirm').value = '';
        
        // Save automatically
        autoSaveConfig('Admin credentials updated successfully!');
    } else {
        showStatus('No changes to save', 'error');
    }
}

// ============================================
// Auto Save Config - Downloads file automatically
// ============================================

function autoSaveConfig(successMessage) {
    try {
        // 1. Save to localStorage for immediate use
        localStorage.setItem('sufferland_config', JSON.stringify(currentConfig));
        
        // 2. Create and download the config.json file
        const configJson = JSON.stringify(currentConfig, null, 2);
        const blob = new Blob([configJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // 3. Show success message
        showStatus(successMessage + ' config.json downloaded!', 'success');
        
        // 4. Update preview if visible
        loadConfigPreview();
        
        console.log('Config saved and downloaded automatically');
    } catch (error) {
        console.error('Save failed:', error);
        showStatus('Save failed: ' + error.message, 'error');
    }
}

// ============================================
// File Operations
// ============================================

function downloadConfig() {
    const configJson = JSON.stringify(currentConfig, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    showStatus('config.json downloaded!', 'success');
}

function loadConfigPreview() {
    const previewBox = document.getElementById('config-preview');
    if (previewBox) {
        previewBox.textContent = JSON.stringify(currentConfig, null, 2);
    }
}

// ============================================
// Utility Functions
// ============================================

function showStatus(message, type) {
    const statusMessage = document.getElementById('status-message');
    const statusText = document.getElementById('status-text');
    
    if (statusMessage && statusText) {
        statusText.textContent = message;
        statusMessage.className = `status-message ${type} show`;
        
        // Auto hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.classList.remove('show');
            }, 5000);
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        
        // Determine which section is active and save accordingly
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            const sectionId = activeSection.id;
            
            if (sectionId === 'server-section') {
                saveServerInfo();
            } else if (sectionId === 'ranks-section') {
                saveRanks();
            } else if (sectionId === 'discord-section') {
                saveDiscord();
            } else if (sectionId === 'settings-section') {
                saveSettings();
            }
        }
    }
});

// Console message
console.log('%c SUFFERLAND Admin Panel ', 'background: linear-gradient(135deg, #6b21a8, #dc2626); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
console.log('%cAuto-save enabled - One click to save!', 'color: #22c55e; font-size: 14px;');
