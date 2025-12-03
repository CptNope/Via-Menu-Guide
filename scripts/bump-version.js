#!/usr/bin/env node

/**
 * Version Bump Script
 * Automatically updates APP_VERSION in service-worker.js to match package.json
 * 
 * Usage:
 *   node scripts/bump-version.js
 *   npm version patch && node scripts/bump-version.js
 */

const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const newVersion = packageJson.version;

// Read service-worker.js
const swPath = path.join(__dirname, '..', 'src', 'service-worker.js');
let swContent = fs.readFileSync(swPath, 'utf8');

// Find and replace APP_VERSION
const versionRegex = /const APP_VERSION = ['"]([^'"]+)['"]/;
const match = swContent.match(versionRegex);

if (!match) {
  console.error('❌ Could not find APP_VERSION in service-worker.js');
  process.exit(1);
}

const oldVersion = match[1];

if (oldVersion === newVersion) {
  console.log(`✅ Version already up to date: ${newVersion}`);
  process.exit(0);
}

// Replace version
swContent = swContent.replace(
  versionRegex,
  `const APP_VERSION = '${newVersion}'`
);

// Write back
fs.writeFileSync(swPath, swContent, 'utf8');

console.log(`✅ Updated APP_VERSION: ${oldVersion} → ${newVersion}`);
console.log(`📝 File: src/service-worker.js`);
console.log(`\n🚀 Ready to build and deploy!`);
console.log(`   npm run build`);
console.log(`   npm run deploy`);
