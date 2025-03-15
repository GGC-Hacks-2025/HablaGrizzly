const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourcePath = path.join(__dirname, 'favicon.png');
const outputDir = path.join(__dirname, 'public');

async function optimizeFavicon() {
  try {
    const sharpImg = sharp(sourcePath);
    
    // Create 16x16 favicon
    await sharpImg.clone()
      .resize(16, 16)
      .toFile(path.join(outputDir, 'favicon-16x16.png'));
    
    // Create 32x32 favicon
    await sharpImg.clone()
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    
    // Create apple touch icon (180x180)
    await sharpImg.clone()
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    
    // Create a slightly smaller version of the original
    await sharpImg.clone()
      .resize(64, 64)
      .toFile(path.join(outputDir, 'favicon.png'));
    
    console.log('All favicon images have been generated successfully!');
  } catch (error) {
    console.error('Error generating favicon images:', error);
  }
}

optimizeFavicon(); 