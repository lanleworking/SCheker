// make-icon.js
import sharp from 'sharp';
import fs from 'fs';
import pngToIco from 'png-to-ico';

const sizes = [16, 32, 48, 256];
const input = 'public/icon.png';
const outPngs = [];

async function main() {
    for (const size of sizes) {
        const out = `build/icon-${size}.png`;
        await sharp(input).resize(size, size).toFile(out);
        outPngs.push(out);
    }
    const ico = await pngToIco(outPngs);
    fs.writeFileSync('build/icon.ico', ico);
    console.log('✅ Multi-size icon generated at build/icon.ico');
}

main();
