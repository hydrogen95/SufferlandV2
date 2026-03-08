/* ============================================
   SUFFERLAND - Minecraft Server Website
   Main JavaScript - Fixed Server Status
   ============================================ */

// Configuration (will be loaded from config.json)
let config = {
    server: {
        name: "SUFFERLAND",
        ip: "suffer.mcnation.xyz",
        port: "4088",
        description: "Join the ultimate SwordSMP x InfuseSMP x Economy hybrid experience",
        tagline: "Survival Reimagined. PvP Perfected."
    },
    discord: {
        link: "https://discord.gg/XaUBr97NUW"
    },
    payment: {
        gcash: {
            number: "09937978735",
            name: "JO*N R."
        },
        paymaya: {
            number: "09069634225"
        }
    },
    ranks: {
        vip: {
            name: "VIP",
            price: 50,
            perks: [
                "2x Homes",
                "10x Concurrent Auctions",
                "/grindstone Command",
                "/disposal Command",
                "/ec Command",
                "/kit Command"
            ]
        },
        mvp: {
            name: "MVP",
            price: 100,
            perks: [
                "3x Homes",
                "15x Concurrent Auctions",
                "/cartographytable Command",
                "/stonecutter Command",
                "/disposal Command",
                "/craft Command",
                "/grindstone Command",
                "/kit Command"
            ]
        },
        elite: {
            name: "ELITE",
            price: 150,
            perks: [
                "4x Homes",
                "20x Concurrent Auctions",
                "/craft Command",
                "/ec Command",
                "/disposal Command",
                "/stonecutter Command",
                "/grindstone Command",
                "/repair Command",
                "/anvil Command",
                "/cartographytable Command",
                "/kit Command"
            ]
        },
        giant: {
            name: "GIANT",
            price: 200,
            perks: [
                "5x Homes",
                "25x Concurrent Auctions",
                "/craft Command",
                "/ec Command",
                "/disposal Command",
                "/stonecutter Command",
                "/grindstone Command",
                "/anvil Command",
                "/smithingtable Command",
                "/cartographytable Command",
                "/repair Command",
                "/ptime Command",
                "/kit Command"
            ]
        },
        titan: {
            name: "TITAN",
            price: 400,
            perks: [
                "7x Homes",
                "30x Concurrent Auctions",
                "/craft Command",
                "/cartographytable Command",
                "/ec Command",
                "/stonecutter Command",
                "/grindstone Command",
                "/anvil Command",
                "/smithingtable Command",
                "/ptime Command",
                "/pweather Command",
                "/repair Command",
                "/near Command",
                "/kit Command"
            ]
        }
    }
};

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initParticles();
    initNavbar();
    initScrollAnimations();
    fetchServerStatus();
    updateDiscordLink();
    initRankStore();
    
    // Fetch server status every 30 seconds
    setInterval(fetchServerStatus, 30000);
});

// ============================================
// Configuration Loading
// ============================================

async function loadConfig() {
    try {
        // Try localStorage first (for admin panel updates)
        const savedConfig = localStorage.getItem('sufferland_config');
        if (savedConfig) {
            config = { ...config, ...JSON.parse(savedConfig) };
            console.log('Config loaded from localStorage');
        } else {
            // Try to fetch from config.json
            const response = await fetch('config.json');
            if (response.ok) {
                const loadedConfig = await response.json();
                config = { ...config, ...loadedConfig };
                console.log('Config loaded from file');
            }
        }
        applyConfig();
    } catch (error) {
        console.log('Using default config');
        applyConfig();
    }
}

function applyConfig() {
    // Update server info
    document.getElementById('server-ip').textContent = config.server.ip;
    document.getElementById('server-port').textContent = config.server.port;
    document.getElementById('hero-tagline').textContent = config.server.tagline;
    document.getElementById('hero-description').textContent = config.server.description;
    
    // Update rank prices
    document.querySelector('[data-price="vip"]').textContent = config.ranks.vip.price;
    document.querySelector('[data-price="mvp"]').textContent = config.ranks.mvp.price;
    document.querySelector('[data-price="elite"]').textContent = config.ranks.elite.price;
    document.querySelector('[data-price="giant"]').textContent = config.ranks.giant.price;
    document.querySelector('[data-price="titan"]').textContent = config.ranks.titan.price;
    
    // Update rank perks
    updateRankPerks('vip', config.ranks.vip.perks);
    updateRankPerks('mvp', config.ranks.mvp.perks);
    updateRankPerks('elite', config.ranks.elite.perks);
    updateRankPerks('giant', config.ranks.giant.perks);
    updateRankPerks('titan', config.ranks.titan.perks);
}

function updateRankPerks(rankId, perks) {
    const perksList = document.getElementById(`${rankId}-perks`);
    if (perksList && perks) {
        perksList.innerHTML = perks.map(perk => {
            const icon = getPerkIcon(perk);
            return `<li><i class="${icon}"></i> ${perk}</li>`;
        }).join('');
    }
}

function getPerkIcon(perk) {
    if (perk.includes('Home')) return 'fas fa-home';
    if (perk.includes('Auction')) return 'fas fa-gavel';
    if (perk.includes('Command')) return 'fas fa-terminal';
    return 'fas fa-check';
}

function updateDiscordLink() {
    const discordLinks = document.querySelectorAll('a[href="#discord"], #discord-link');
    discordLinks.forEach(link => {
        if (config.discord && config.discord.link) {
            link.href = config.discord.link;
        }
    });
}

// ============================================
// Particle System
// ============================================

function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    const isRed = Math.random() > 0.5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.background = isRed ? '#f87171' : '#a855f7';
    particle.style.boxShadow = `0 0 10px ${isRed ? '#f87171' : '#a855f7'}`;
    
    container.appendChild(particle);
}

// ============================================
// Navbar
// ============================================

function initNavbar() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .rank-card, .section-header');
    animateElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ============================================
// Server Status - FIXED
// ============================================

async function fetchServerStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const statusDot = statusIndicator?.querySelector('.status-dot');
    const playerCount = document.getElementById('player-count');
    
    try {
        // Using mcsrvstat.us API - works with both Java and Bedrock
        const serverAddress = `${config.server.ip}:${config.server.port}`;
        const response = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        console.log('Server status response:', data);
        
        if (data.online === true) {
            // Server is ONLINE
            if (statusDot) {
                statusDot.classList.remove('offline');
                statusDot.classList.add('online');
            }
            if (statusText) statusText.textContent = 'Online';
            
            // Update player count
            if (playerCount) {
                const online = data.players?.online ?? 0;
                const max = data.players?.max ?? 0;
                playerCount.textContent = `${online} / ${max}`;
            }
            
            // Update server info from API if available
            if (data.motd?.clean) {
                console.log('Server MOTD:', data.motd.clean);
            }
            
        } else {
            // Server is OFFLINE
            setServerOffline(statusDot, statusText, playerCount);
        }
    } catch (error) {
        console.error('Failed to fetch server status:', error);
        setServerOffline(statusDot, statusText, playerCount);
    }
}

function setServerOffline(statusDot, statusText, playerCount) {
    if (statusDot) {
        statusDot.classList.remove('online');
        statusDot.classList.add('offline');
    }
    if (statusText) statusText.textContent = 'Offline';
    if (playerCount) playerCount.textContent = '-- / --';
}

// ============================================
// Rank Store with Payment
// ============================================

function initRankStore() {
    const rankBtns = document.querySelectorAll('.rank-btn');
    
    rankBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const rankCard = this.closest('.rank-card');
            const rankName = rankCard?.querySelector('.rank-badge')?.textContent;
            const rankPrice = rankCard?.querySelector('.amount')?.textContent;
            const rankId = rankCard?.dataset.rank;
            
            if (rankName && rankPrice && rankId) {
                openPaymentModal(rankName, rankPrice, rankId);
            }
        });
    });
}

function openPaymentModal(rankName, rankPrice, rankId) {
    // Remove existing modal if any
    const existingModal = document.getElementById('payment-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Get payment info from config
    const gcashNumber = config.payment?.gcash?.number || '09937978735';
    const gcashName = config.payment?.gcash?.name || 'JO*N R.';
    const paymayaNumber = config.payment?.paymaya?.number || '09069634225';
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'payment-modal';
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-overlay" onclick="closePaymentModal()"></div>
        <div class="payment-modal-content">
            <button class="payment-modal-close" onclick="closePaymentModal()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="payment-modal-header">
                <div class="payment-rank-icon rank-${rankId.toLowerCase()}">
                    <i class="fas fa-crown"></i>
                </div>
                <h2>Purchase ${rankName}</h2>
                <p class="payment-price">₱${rankPrice}</p>
            </div>
            
            <div class="payment-methods">
                <h3>Select Payment Method</h3>
                
                <div class="payment-method gcash" onclick="selectPayment('gcash')">
                    <div class="payment-method-header">
                        <div class="payment-logo gcash-logo">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="payment-info">
                            <h4>GCash</h4>
                            <p>Send payment to GCash number</p>
                        </div>
                        <div class="payment-radio">
                            <input type="radio" name="payment" value="gcash" id="pay-gcash">
                            <span class="radio-check"></span>
                        </div>
                    </div>
                    <div class="payment-details" id="gcash-details">
                        <div class="payment-number">
                            <span class="label">GCash Number:</span>
                            <span class="number" id="gcash-num">${gcashNumber}</span>
                            <button class="copy-btn" onclick="copyPaymentNumber('gcash-num', event)">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="payment-name">
                            <span class="label">Account Name:</span>
                            <span class="name">${gcashName}</span>
                        </div>
                    </div>
                </div>
                
                <div class="payment-method paymaya" onclick="selectPayment('paymaya')">
                    <div class="payment-method-header">
                        <div class="payment-logo paymaya-logo">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <div class="payment-info">
                            <h4>PayMaya</h4>
                            <p>Send payment to PayMaya number</p>
                        </div>
                        <div class="payment-radio">
                            <input type="radio" name="payment" value="paymaya" id="pay-paymaya">
                            <span class="radio-check"></span>
                        </div>
                    </div>
                    <div class="payment-details" id="paymaya-details">
                        <div class="payment-number">
                            <span class="label">PayMaya Number:</span>
                            <span class="number" id="paymaya-num">${paymayaNumber}</span>
                            <button class="copy-btn" onclick="copyPaymentNumber('paymaya-num', event)">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="payment-instructions">
                <h4><i class="fas fa-info-circle"></i> How to Purchase</h4>
                <ol>
                    <li>Select your preferred payment method above</li>
                    <li>Send <strong>₱${rankPrice}</strong> to the displayed number</li>
                    <li>Take a screenshot of your payment receipt</li>
                    <li>Join our Discord and create a ticket</li>
                    <li>Send your receipt and Minecraft username</li>
                    <li>Your rank will be activated within 24 hours!</li>
                </ol>
            </div>
            
            <div class="payment-actions">
                <a href="${config.discord.link}" target="_blank" class="btn btn-discord">
                    <i class="fab fa-discord"></i>
                    Join Discord to Complete Purchase
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function selectPayment(method) {
    // Update radio buttons
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.checked = radio.value === method;
    });
    
    // Update visual selection
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`.payment-method.${method}`).classList.add('selected');
    
    // Show details
    document.querySelectorAll('.payment-details').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById(`${method}-details`).style.display = 'block';
}

function copyPaymentNumber(elementId, event) {
    event.stopPropagation();
    const number = document.getElementById(elementId).textContent;
    
    navigator.clipboard.writeText(number).then(() => {
        showToast('Number copied to clipboard!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = number;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Number copied to clipboard!');
    });
}

// ============================================
// Utility Functions
// ============================================

function copyServerIP() {
    const ip = config.server.ip;
    const port = config.server.port;
    const fullAddress = `${ip}:${port}`;
    
    navigator.clipboard.writeText(fullAddress).then(() => {
        showToast('Server IP copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = fullAddress;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Server IP copied to clipboard!');
    });
}

function showToast(message) {
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Parallax Effect for Hero
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroLogo = document.querySelector('.hero-logo, .hero-logo-fallback');
    
    if (heroLogo && scrolled < window.innerHeight) {
        heroLogo.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Press 'C' to copy server IP
    if (e.key === 'c' || e.key === 'C') {
        if (e.ctrlKey || e.metaKey) return; // Don't interfere with copy command
        copyServerIP();
    }
    
    // ESC to close modal
    if (e.key === 'Escape') {
        closePaymentModal();
    }
});

// ============================================
// Performance: Pause animations when tab is hidden
// ============================================

document.addEventListener('visibilitychange', () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
});

// ============================================
// Console Easter Egg
// ============================================

console.log('%c SUFFERLAND ', 'background: linear-gradient(135deg, #6b21a8, #dc2626); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
console.log('%cWelcome to SUFFERLAND - Survival Reimagined. PvP Perfected.', 'color: #a855f7; font-size: 14px;');
console.log('%cServer: suffer.mcnation.xyz:4088', 'color: #f87171; font-size: 12px;');
console.log('%cPayment methods: GCash & PayMaya now available!', 'color: #22c55e; font-size: 12px;');
