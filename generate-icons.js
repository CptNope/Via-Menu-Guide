const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Icon sizes configuration
const iconSizes = [
  { name: 'icon-72.png', size: 72 },
  { name: 'icon-96.png', size: 96 },
  { name: 'icon-128.png', size: 128 },
  { name: 'icon-144.png', size: 144 },
  { name: 'icon-152.png', size: 152 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-384.png', size: 384 },
  { name: 'icon-512.png', size: 512 }
];

const maskableIconSizes = [
  { name: 'icon-maskable-192.png', size: 192 },
  { name: 'icon-maskable-512.png', size: 512 }
];

const appleTouchIconSizes = [
  { name: 'apple-touch-icon-57.png', size: 57 },
  { name: 'apple-touch-icon-60.png', size: 60 },
  { name: 'apple-touch-icon-72.png', size: 72 },
  { name: 'apple-touch-icon-76.png', size: 76 },
  { name: 'apple-touch-icon-114.png', size: 114 },
  { name: 'apple-touch-icon-120.png', size: 120 },
  { name: 'apple-touch-icon-144.png', size: 144 },
  { name: 'apple-touch-icon-152.png', size: 152 },
  { name: 'apple-touch-icon-180.png', size: 180 },
  { name: 'apple-touch-icon.png', size: 180 }
];

const splashScreenSizes = [
  { name: 'splash-640x1136.png', width: 640, height: 1136 },
  { name: 'splash-750x1334.png', width: 750, height: 1334 },
  { name: 'splash-828x1792.png', width: 828, height: 1792 },
  { name: 'splash-1125x2436.png', width: 1125, height: 2436 },
  { name: 'splash-1242x2688.png', width: 1242, height: 2688 }
];

async function generateIcons() {
  console.log('🎨 Generating PWA icons from SVG sources...\n');

  try {
    // Check if sharp is installed
    try {
      require.resolve('sharp');
    } catch (e) {
      console.error('❌ Sharp is not installed. Installing now...');
      const { execSync } = require('child_process');
      execSync('npm install --save-dev sharp', { stdio: 'inherit' });
      console.log('✅ Sharp installed successfully!\n');
    }

    const iconSource = path.join(publicDir, 'icon-source.svg');
    const maskableSource = path.join(publicDir, 'icon-maskable-source.svg');
    const splashSource = path.join(publicDir, 'splash-source.svg');

    // Generate standard icons
    console.log('📱 Generating standard PWA icons...');
    for (const icon of iconSizes) {
      await sharp(iconSource)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(publicDir, icon.name));
      console.log(`  ✓ Created ${icon.name}`);
    }

    // Generate maskable icons
    console.log('\n🎭 Generating maskable icons...');
    for (const icon of maskableIconSizes) {
      await sharp(maskableSource)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(publicDir, icon.name));
      console.log(`  ✓ Created ${icon.name}`);
    }

    // Generate Apple Touch Icons
    console.log('\n🍎 Generating Apple Touch Icons...');
    for (const icon of appleTouchIconSizes) {
      await sharp(iconSource)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(publicDir, icon.name));
      console.log(`  ✓ Created ${icon.name}`);
    }

    // Generate splash screens
    console.log('\n🌅 Generating iOS splash screens...');
    for (const splash of splashScreenSizes) {
      await sharp(splashSource)
        .resize(splash.width, splash.height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(path.join(publicDir, splash.name));
      console.log(`  ✓ Created ${splash.name}`);
    }

    // Generate favicon
    console.log('\n🔖 Generating favicon...');
    await sharp(iconSource)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('  ✓ Created favicon.png');
    console.log('  ℹ️  Note: Convert favicon.png to favicon.ico using an online tool for better browser support');

    console.log('\n✨ All icons generated successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • ${iconSizes.length} standard PWA icons`);
    console.log(`  • ${maskableIconSizes.length} maskable icons`);
    console.log(`  • ${appleTouchIconSizes.length} Apple Touch icons`);
    console.log(`  • ${splashScreenSizes.length} splash screens`);
    console.log(`  • 1 favicon`);
    console.log(`  Total: ${iconSizes.length + maskableIconSizes.length + appleTouchIconSizes.length + splashScreenSizes.length + 1} files\n`);

    console.log('🚀 Next steps:');
    console.log('  1. Convert favicon.png to favicon.ico (optional)');
    console.log('  2. Test your PWA with Chrome DevTools (F12 → Application → Manifest)');
    console.log('  3. Run Lighthouse audit for PWA score');
    console.log('  4. Deploy to HTTPS server');

  } catch (error) {
    console.error('\n❌ Error generating icons:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  • Make sure icon-source.svg, icon-maskable-source.svg, and splash-source.svg exist in public/');
    console.error('  • Try running: npm install --save-dev sharp');
    console.error('  • Check that you have write permissions in the public/ folder');
    process.exit(1);
  }
}

// Run the generator
generateIcons();
