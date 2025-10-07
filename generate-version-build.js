// // Only run in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Skipping version update in development mode');
  process.exit(0);
}

// generate-build-version.js

// Importing required modules
const fs = require('fs');
const path = require('path');
const semver = require('semver');

// Reading the current version from package.json
const packageJson = require('./package.json');
const appVersion = packageJson.version;

// Function to increment the version based on semantic versioning rules
const incrementVersion = (version) => {
  const versionArray = version.split('.');
  const [major, minor, patch] = versionArray;

  // Check if the patch version is 9, incrementing the minor version
  if (parseInt(patch) === 9) {
    const newMinor = parseInt(minor) + 1;
    return `${major}.${newMinor}.0`;
  }

  // Incrementing the patch version
  const newPatch = parseInt(patch) + 1;
  return `${major}.${minor}.${newPatch}`;
};

// Calculating the new version using the incrementVersion function
const newVersion = incrementVersion(appVersion);

// Updating package.json with the new version
packageJson.version = newVersion;
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2), 'utf-8');

// Creating meta.json with version information
const metaJson = { version: newVersion, oldVersion: appVersion };
fs.writeFileSync('./public/version.json', JSON.stringify(metaJson, null, 2), 'utf8');

// Logging a message indicating successful version update
console.log('Version has been updated in package.json and meta.json');