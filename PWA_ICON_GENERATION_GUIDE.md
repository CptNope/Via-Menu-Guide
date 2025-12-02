# PWA Icon Generation Guide

## Required Icon Sizes

Your PWA needs the following images in the `public/` folder:

### Standard PWA Icons (Android, Desktop)
- `icon-72.png` (72x72px)
- `icon-96.png` (96x96px)
- `icon-128.png` (128x128px)
- `icon-144.png` (144x144px)
- `icon-152.png` (152x152px)
- `icon-192.png` (192x192px) - **Minimum required**
- `icon-384.png` (384x384px)
- `icon-512.png` (512x512px) - **Minimum required**

### Maskable Icons (Adaptive Android)
- `icon-maskable-192.png` (192x192px with safe zone)
- `icon-maskable-512.png` (512x512px with safe zone)

### Apple Touch Icons (iOS)
- `apple-touch-icon.png` (180x180px default)
- `apple-touch-icon-57.png` (57x57px)
- `apple-touch-icon-60.png` (60x60px)
- `apple-touch-icon-72.png` (72x72px)
- `apple-touch-icon-76.png` (76x76px)
- `apple-touch-icon-114.png` (114x114px)
- `apple-touch-icon-120.png` (120x120px)
- `apple-touch-icon-144.png` (144x144px)
- `apple-touch-icon-152.png` (152x152px)
- `apple-touch-icon-180.png` (180x180px)

### iOS Splash Screens
- `splash-640x1136.png` (iPhone SE, 5s)
- `splash-750x1334.png` (iPhone 8, 7, 6s)
- `splash-828x1792.png` (iPhone 11, XR)
- `splash-1125x2436.png` (iPhone X, XS, 11 Pro)
- `splash-1242x2688.png` (iPhone 11 Pro Max, XS Max)

### Favicon
- `favicon.ico` (32x32px or multi-size .ico file)

---

## Quick Generation Methods

### Option 1: Use Online PWA Asset Generator (Easiest)
**Recommended Tool:** https://www.pwabuilder.com/imageGenerator

1. Upload your logo/icon (1024x1024px recommended)
2. Select "Generate"
3. Download the zip file
4. Extract all images to your `public/` folder

### Option 2: Use RealFaviconGenerator
**Website:** https://realfavicongenerator.net/

1. Upload your master icon (SVG or high-res PNG 512x512+)
2. Customize for each platform
3. Download the package
4. Copy files to `public/` folder

### Option 3: Manual with Photoshop/GIMP/Figma

#### Source Image Requirements:
- **Size:** 1024x1024px minimum (2048x2048px recommended)
- **Format:** PNG with transparency
- **Design:** Center your logo with 20% padding for maskable icons

#### Design Guidelines:

**Standard Icons:**
- Use full bleed (0% safe zone)
- Logo can extend to edges
- Background: White or brand color (#5a2a27)

**Maskable Icons:**
- Keep important content in center 80% (safe zone)
- Outer 20% may be cropped on some Android devices
- Use solid background color
- No transparency in safe zone

**Apple Touch Icons:**
- iOS adds rounded corners automatically
- No transparency (use solid background)
- Avoid placing critical elements in corners

**Splash Screens:**
- Center your logo
- Background: White (#ffffff) or brand color
- Logo should be ~30% of screen height
- Leave space for status bar at top

---

## Using Figma Template (Recommended)

### VIA Menu Icon Template

Create a Figma file with these artboards:

```
Master Icon (1024x1024)
├─ Logo centered
├─ Safe zone guide (80% circle)
└─ Background: #5a2a27

Standard Icons
├─ Full bleed allowed
└─ Export at all sizes

Maskable Icons
├─ Keep logo in safe zone (inner 80%)
└─ Export with padding

Apple Touch Icons
├─ Avoid corners (iOS adds rounded corners)
└─ Solid background

Splash Screens
├─ Logo centered (30% height)
├─ Brand color background
└─ Status bar space at top
```

---

## Quick Command-Line Generation (ImageMagick)

If you have ImageMagick installed:

```bash
# Generate standard icons
convert master-icon.png -resize 72x72 icon-72.png
convert master-icon.png -resize 96x96 icon-96.png
convert master-icon.png -resize 128x128 icon-128.png
convert master-icon.png -resize 144x144 icon-144.png
convert master-icon.png -resize 152x152 icon-152.png
convert master-icon.png -resize 192x192 icon-192.png
convert master-icon.png -resize 384x384 icon-384.png
convert master-icon.png -resize 512x512 icon-512.png

# Generate Apple Touch Icons
convert master-icon.png -resize 180x180 apple-touch-icon.png
convert master-icon.png -resize 152x152 apple-touch-icon-152.png
# ... repeat for all sizes

# Generate maskable icons (add 20% padding)
convert master-icon.png -resize 80% -gravity center -extent 192x192 -background "#5a2a27" icon-maskable-192.png
convert master-icon.png -resize 80% -gravity center -extent 512x512 -background "#5a2a27" icon-maskable-512.png
```

---

## Splash Screen Generation Script

Create splash screens with centered logo:

```bash
# iPhone SE (640x1136)
convert -size 640x1136 xc:"#ffffff" \
  \( master-icon.png -resize 200x200 \) \
  -gravity center -composite splash-640x1136.png

# iPhone 8 (750x1334)
convert -size 750x1334 xc:"#ffffff" \
  \( master-icon.png -resize 250x250 \) \
  -gravity center -composite splash-750x1334.png

# iPhone XR (828x1792)
convert -size 828x1792 xc:"#ffffff" \
  \( master-icon.png -resize 300x300 \) \
  -gravity center -composite splash-828x1792.png

# iPhone X (1125x2436)
convert -size 1125x2436 xc:"#ffffff" \
  \( master-icon.png -resize 400x400 \) \
  -gravity center -composite splash-1125x2436.png

# iPhone Pro Max (1242x2688)
convert -size 1242x2688 xc:"#ffffff" \
  \( master-icon.png -resize 450x450 \) \
  -gravity center -composite splash-1242x2688.png
```

---

## VIA Menu Brand Colors

Use these colors for your icons:

- **Primary:** `#5a2a27` (Dark wine red)
- **Background:** `#ffffff` (White)
- **Text:** `#000000` (Black)

---

## Design Tips

### Icon Design:
1. **Simple & Recognizable:** Icon should be identifiable at 72x72px
2. **High Contrast:** Ensure visibility on light and dark backgrounds
3. **No Text:** Avoid small text (illegible at small sizes)
4. **Centered:** Keep main elements in center for maskable compatibility

### Splash Screen Design:
1. **Fast Loading:** Keep file sizes under 200KB
2. **Brand Consistent:** Use brand colors
3. **Minimal Design:** Just logo + background
4. **Status Bar Space:** Leave 40-60px at top

---

## Validation

After generating icons, validate your PWA:

### Chrome DevTools:
1. Open DevTools (F12)
2. Go to Application > Manifest
3. Check all icons load correctly
4. Verify "Add to Home Screen" appears

### Lighthouse:
1. Run Lighthouse audit
2. Check PWA score
3. Verify all icon sizes are correct

### iOS Testing:
1. Open in Safari on iPhone
2. Tap Share button
3. Select "Add to Home Screen"
4. Verify icon and splash screen appear

---

## Current Status

You currently have placeholders (0 bytes) for these files. Generate them using one of the methods above!

**Files to create:** 33 image files total
- 8 standard icons
- 2 maskable icons
- 10 Apple Touch icons
- 5 splash screens
- 1 favicon

---

## Next Steps

1. **Choose generation method** (PWABuilder.com recommended)
2. **Create/upload your master icon** (1024x1024px)
3. **Generate all sizes**
4. **Copy to `public/` folder**
5. **Test installation** on Android, iOS, and Desktop
6. **Run Lighthouse** to verify PWA score

Your PWA will then be installable on ALL devices! 📱💻🎉
