# SUFFERLAND Minecraft Server Website

A modern, responsive, and visually stunning website for the SUFFERLAND Minecraft server featuring a purple-red gradient theme, live server status, rank shop, and an admin panel for easy content management.

![SUFFERLAND Logo](https://i.imgur.com/placeholder.png)

## Features

- **Modern Design**: Purple and red gradient theme with smooth animations
- **Live Server Status**: Real-time player count and server status
- **Rank Shop**: Display all server ranks with prices and perks
- **Discord Integration**: Easy access to Discord server
- **Admin Panel**: Edit website content without touching code
- **Fully Responsive**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Professional transitions and hover effects

## File Structure

All files are standalone (no folders) for easy GitHub deployment:

```
sufferland-website/
├── index.html          # Main website
├── style.css           # All styles
├── script.js           # Main website JavaScript
├── config.json         # Website configuration
├── login.html          # Admin login page
├── admin.html          # Admin dashboard
├── admin.js            # Admin panel JavaScript
├── server.js           # Node.js backend (optional)
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## Quick Start

### Option 1: Static Hosting (GitHub Pages, Netlify, etc.)

1. Upload all files to your hosting platform
2. Edit `config.json` directly to customize content
3. Your website is live!

### Option 2: With Node.js Backend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in your browser

## Admin Panel

### Default Login
- **Username**: `admin`
- **Password**: `sufferland2024`

### Accessing the Admin Panel
1. Go to `yourwebsite.com/login.html`
2. Enter your credentials
3. Start editing!

### What You Can Edit
- Server information (IP, port, description)
- Rank names, prices, and perks
- Discord server link
- Website text and descriptions

## Configuration

The `config.json` file contains all editable content:

```json
{
  "server": {
    "name": "SUFFERLAND",
    "ip": "suffer.mcnation.xyz",
    "port": "4088",
    "description": "...",
    "tagline": "Survival Reimagined. PvP Perfected."
  },
  "discord": {
    "link": "https://discord.gg/sufferland"
  },
  "ranks": {
    "vip": {
      "name": "VIP",
      "price": 50,
      "perks": [...]
    },
    ...
  }
}
```

## Customization

### Changing Colors
Edit the CSS variables in `style.css`:

```css
:root {
  --primary-purple: #6b21a8;
  --crimson-red: #dc2626;
  --neon-purple: #a855f7;
  ...
}
```

### Adding/Removing Ranks
1. Edit `config.json` to add/remove rank objects
2. Update `index.html` to add/remove rank cards
3. Update `admin.html` to add/remove rank editors

### Changing Admin Credentials
1. Log in to the admin panel
2. Go to Settings
3. Enter new username/password
4. Save changes

## API Endpoints (Node.js)

When using the Node.js backend:

- `GET /api/config` - Get configuration
- `POST /api/config` - Update configuration
- `POST /api/admin/login` - Admin login
- `GET /api/server-status` - Get Minecraft server status
- `GET /api/health` - Health check

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Credits

- **Fonts**: Orbitron, Rajdhani (Google Fonts)
- **Icons**: Font Awesome 6
- **Minecraft Server API**: mcsrvstat.us

## License

MIT License - Feel free to use and modify!

---

**SUFFERLAND** - Survival Reimagined. PvP Perfected.
