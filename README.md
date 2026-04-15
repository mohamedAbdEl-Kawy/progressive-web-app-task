# ITI PWA Task 1

A **Progressive Web Application** built as part of the ITI PWA Course. This project demonstrates core PWA concepts including offline support, service workers, app installation, and responsive design.

## 🚀 Live Demo

**[Live Demo Link](#)** ← *Add your live demo URL here*

## ✨ Features

- **📱 Responsive Design** - Works seamlessly on all devices (mobile, tablet, desktop)
- **🔌 Offline Support** - Continue browsing even without an internet connection
- **⚡ Fast Loading** - Service Workers cache assets for instant page loads
- **📥 Installable** - Install as a native app on your device with a single click
- **🎨 Standalone Mode** - Runs like a native app with full-screen experience
- **⚙️ Service Worker** - Automatic caching and offline page handling
- **🛡️ Custom Error Handling** - User-friendly 404 and offline error pages

## 🛠️ Tech Stack

- **HTML5** - Semantic markup and PWA manifest integration
- **CSS3** - Modern styling with responsive layouts
- **JavaScript** - Vanilla JS for app functionality and service worker management
- **Web APIs** - Service Workers, Installation Events, Cache API

## 📂 Project Structure

```
.
├── index.html              # Homepage
├── manifest.json           # PWA manifest file
├── sw.js                   # Service Worker script
├── css/
│   └── styles.css          # Stylesheet
├── js/
│   └── script.js           # Main JavaScript logic
├── img/                    # Project images and icons
├── pages/
│   ├── 404.html           # Custom 404 error page
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   └── offline.html       # Offline fallback page
└── README.md              # This file
```

## 🎯 Key Features Implemented

### 1. **Service Worker & Caching**
- Automatic caching of all assets on first visit
- New requests are cached for offline access
- Efficient cache management for better performance

### 2. **Offline Support**
- Custom offline page displayed when no internet connection
- Navigation links to return to home page
- Seamless user experience even without connectivity

### 3. **404 Error Handling**
- Custom 404 page for wrong URL requests
- Helpful navigation back to homepage
- User-friendly error messages

### 4. **Installation Button**
- Custom install button triggers app installation prompt
- Users can add the app to their home screen
- Enhanced standalone experience

### 5. **Multi-Page Navigation**
- Home page with features showcase
- About page with project information
- Contact page for user inquiries
- Persistent navigation across all pages

## 📲 How to Use

### View the Project
1. Clone or download the repository
2. Open `index.html` in a web browser
3. The app works best in Chrome, Firefox, or Edge browsers

### Install as App
1. Click the **"📥 Install App"** button in the navbar
2. Confirm the installation prompt
3. The app will be added to your home screen

### Test Offline Mode
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline" to simulate no internet
4. Navigate to any page to see offline fallback

### Mobile Testing
1. Build and serve the app on a local server
2. Access via your mobile device on the same network
3. Click the install prompt to add to home screen

## 🔧 Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local web server (recommended for testing)

### Quick Start
```bash
# Using Python (if installed)
python -m http.server 8000

# Or using Node.js (with http-server)
npx http-server

# Then open: http://localhost:8000
```

## 📋 Requirements Checklist

- ✅ Implement all basic PWA functionality
- ✅ Custom button to display install pop-up
- ✅ Handle offline errors with custom offline page
- ✅ Handle wrong URLs with custom 404 page
- ✅ Save new requests to cache
- ✅ Test on mobile device
- ✅ Responsive design for all screen sizes

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full Support |
| Firefox | ✅ Full Support |
| Edge    | ✅ Full Support |
| Safari  | ⚠️ Limited PWA Support |

## 📝 Notes

- Service Worker requires HTTPS in production (localhost works fine for testing)
- PWA features work best on mobile devices
- Install feature may vary depending on browser and OS

## 👨‍💻 Author

**Course**: ITI PWA Course - Day 01 Task

## 📄 License

This project is created for educational purposes.

---

**Last Updated**: April 2026
