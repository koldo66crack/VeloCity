const fs = require('fs');
const path = require('path');

// Base SVG with placeholder for color and stroke
const baseSVG = (color) => `
<svg width="64" height="64" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <title>location-pin-solid</title>
  <g id="Layer_2" data-name="Layer 2">
    <g id="icons_Q2" data-name="icons Q2">
      <path 
        d="M24,4a12,12,0,0,0-2,23.8V42a2,2,0,0,0,4,0V27.8A12,12,0,0,0,24,4Zm0,16a4,4,0,1,1,4-4A4,4,0,0,1,24,20Z" 
        fill="${color}" 
        stroke="#000000" 
        stroke-width="1.5"
      />
    </g>
  </g>
</svg>
`;

const colors = [
  { rating: 0, color: '#dc2626' }, // Red
  { rating: 1, color: '#facc15' }, // Yellow
  { rating: 2, color: '#22c55e' }  // Green
];

const outputDir = path.join(__dirname, 'src', 'assets', 'markers');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

colors.forEach(({ rating, color }) => {
  const svgContent = baseSVG(color);
  const filePath = path.join(outputDir, `marker-${rating}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Saved: marker-${rating}.svg`);
});
