# PWA Installation Guide

## How to Install VIA Menu PWA on Any Device

---

## 📱 Android Devices

### Chrome Browser

1. **Open the website** in Chrome
2. Wait for the **"Add to Home Screen"** prompt to appear (automatic)
   - OR tap the **⋮ menu** (three dots)
   - Select **"Install app"** or **"Add to Home Screen"**
3. Tap **"Install"** or **"Add"**
4. The app icon will appear on your home screen
5. Open from home screen for full-screen experience

### Samsung Internet

1. Open the website in Samsung Internet
2. Tap the **☰ menu** button
3. Select **"Add page to"**
4. Choose **"Home screen"**
5. Tap **"Add"**

### Firefox (Android)

1. Open the website in Firefox
2. Tap the **⋮ menu**
3. Select **"Install"**
4. Tap **"Add to Home Screen"**

---

## 🍎 iOS Devices (iPhone/iPad)

### Safari (Required for PWA features)

1. **Open the website in Safari** (must use Safari, not Chrome)
2. Tap the **Share button** (rectangle with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. **Edit the name** if desired (default: "VIA Menu")
5. Tap **"Add"** (top right)
6. The app icon will appear on your home screen
7. Open from home screen for app experience

**Note:** iOS PWAs only work properly when installed from Safari. Chrome/Firefox on iOS won't provide full PWA functionality.

---

## 💻 Desktop (Windows/Mac/Linux)

### Chrome

1. **Open the website** in Chrome
2. Look for the **install icon** (⊕) in the address bar (right side)
   - OR click the **⋮ menu** → **"Install VIA Menu..."**
3. Click **"Install"**
4. The app will open in its own window
5. Find the app in:
   - **Windows:** Start Menu & Desktop
   - **Mac:** Applications folder & Dock
   - **Linux:** Application launcher

### Edge

1. Open the website in Edge
2. Click the **⊕ icon** in the address bar
   - OR click **⋯ menu** → **"Apps"** → **"Install this site as an app"**
3. Click **"Install"**
4. App opens in standalone window

### Brave

1. Open the website in Brave
2. Click the **☰ menu**
3. Select **"Install VIA Menu..."**
4. Click **"Install"**

### Firefox (Limited PWA support)

Firefox doesn't fully support PWA installation, but you can:
1. Bookmark the page
2. Or use Chrome/Edge for full PWA experience

---

## ✅ Verification: Is it Installed Correctly?

### You'll know it's working when:

✅ **Standalone window** - App opens in its own window (no browser chrome)
✅ **Home screen icon** - Icon appears on device home screen
✅ **Splash screen** - Brief splash screen when launching (iOS)
✅ **Works offline** - App loads even without internet
✅ **App switcher** - Appears as separate app in task switcher

---

## 🔧 Troubleshooting

### "Add to Home Screen" not appearing (Android)

**Possible causes:**
- Not using HTTPS (required for PWA)
- Service worker not registered
- Missing required manifest fields

**Solution:**
- Ensure you're on `https://` URL
- Clear browser cache and reload
- Check Chrome DevTools → Application → Manifest

### iOS Installation Issues

**Problem:** Can't find "Add to Home Screen"

**Solution:**
- Must use Safari (not Chrome/Firefox)
- Share button → scroll down in menu
- Make sure website is loaded fully

**Problem:** Icon looks wrong or splash screen missing

**Solution:**
- Apple Touch Icons may not be generated yet
- See `PWA_ICON_GENERATION_GUIDE.md`

### Desktop: Install button not showing

**Solution:**
- Try Chrome or Edge (best PWA support)
- Clear cache and reload
- Check if already installed (can't reinstall)

---

## 🗑️ Uninstalling the PWA

### Android

1. Long-press the app icon on home screen
2. Drag to **"Uninstall"** or tap **"App info"**
3. Tap **"Uninstall"**

### iOS

1. Long-press the app icon
2. Tap **"Remove App"**
3. Tap **"Delete App"**

### Desktop (Chrome/Edge)

1. Open the PWA
2. Click **⋮ menu** in app window
3. Select **"Uninstall VIA Menu..."**
4. Confirm uninstall

---

## 🚀 Benefits of Installing

### Offline Access
- View menu without internet connection
- Faster loading times
- No network required after first install

### Native App Experience
- Full-screen mode (no browser UI)
- Appears in app drawer/home screen
- Separate from browser
- Push notifications (if enabled)

### Better Performance
- Cached resources load instantly
- Smooth animations
- No browser overhead

### Privacy
- Doesn't track like a native app
- No app store required
- Easy to uninstall
- No extra permissions

---

## 📊 Device Compatibility

### ✅ Full Support (All PWA Features)
- **Android 5.0+** with Chrome 73+
- **Windows 10/11** with Chrome 73+ or Edge 79+
- **Mac OS** with Chrome 73+ or Edge 79+
- **Linux** with Chrome 73+
- **Chrome OS** - Built-in support

### ⚠️ Partial Support (Limited Features)
- **iOS 11.3 - 16.3** - Safari only, no push notifications
- **Firefox** - Bookmarks only, no true installation

### ❌ No Support
- **iOS browsers** other than Safari (Chrome, Firefox on iOS)
- **Internet Explorer** - Upgrade to Edge

---

## 🎯 For Managers/Staff

### Recommending Installation to Guests

**Talking Points:**
- "Install our menu app for faster access"
- "Works even when Wi-Fi is slow"
- "Get detailed wine pairings and allergen info"
- "Just like a regular app, but no app store needed"

### Installation Demo Script:

**For iPhone users:**
"Open our menu in Safari, tap the share button at the bottom, then tap 'Add to Home Screen'. You'll have our full menu with wine pairings available instantly, even offline!"

**For Android users:**
"When you open our menu, Chrome will ask if you want to install the app. Just tap 'Install' and you'll have quick access from your home screen!"

**For desktop users:**
"Click the install icon in your browser's address bar to add our menu as an app. It'll open in its own window for easy reference!"

---

## 🔐 Security & Privacy

### Is it safe?

✅ **Yes!** PWAs are secure because:
- Requires HTTPS (encrypted connection)
- No special device permissions needed
- Runs in browser sandbox
- Can't access device data without permission
- Easy to uninstall completely

### What data is stored?

- **Menu content** (cached for offline use)
- **User preferences** (if any)
- **No personal data** collected
- **No tracking** beyond standard web analytics

---

## 🆘 Support

### Still having issues?

1. **Check browser version** - Update to latest
2. **Clear browser cache** - Fresh start
3. **Try different browser** - Chrome recommended
4. **Check network connection** - Slow networks may timeout
5. **Restart device** - Classic IT fix

### For Developers

See `PWA_ICON_GENERATION_GUIDE.md` for:
- Icon generation
- Splash screen creation
- Testing procedures
- Validation tools

---

## 📈 Monitoring PWA Performance

### Chrome DevTools

1. **F12** → Application tab
2. Check:
   - Manifest loaded ✓
   - Service Worker active ✓
   - Cache Storage populated ✓
   - Icons loading ✓

### Lighthouse Audit

1. **F12** → Lighthouse tab
2. Select **"Progressive Web App"**
3. Click **"Generate report"**
4. Target score: **90+**

---

## 🎉 Success!

Once installed, users can:
- Access the menu instantly from their home screen
- View offline when network is unavailable
- Enjoy faster loading times
- Get a true app-like experience

**No app store. No downloads. Just install and go!** 📱✨
