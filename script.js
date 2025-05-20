const LIMITS = [900, 700, 100];
const COLORS = ['rgb(0, 37, 11)', 'rgb(0, 130, 37)', 'rgb(20, 180, 65)'];
const END_COLOR = 'rgb(237, 255, 242)';
const FONT = "12px monospace";
let index = 0;

function generateImage() {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  const renderText =
    document.getElementById('spaces').checked ?
      document.getElementById('textInput').value.replace('\t', '').replace(/\s+/g, '').trim() :
      document.getElementById('textInput').value.replace('\t', ' ').replace(/\s+/g, ' ');
  const keyword = document.getElementById('keywordInput').value;
  const seed = parseInt(document.getElementById('seedInput').value) || 0;

  index = 0;
  const r = mulberry32(seed);

  // Clear canvas
  if (document.getElementById('transparent').checked) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.font = FONT;
  const fontWidth = ctx.measureText("A").width * 1.5;
  const fontHeight = parseInt(FONT, 10); // approx height

  for (let i = 0; i < LIMITS.length; i++) {
    const limit = LIMITS[i];

    for (let x = 0; x < canvas.width; x += fontWidth) {
      const height = randBetween(r, limit, canvas.height);
      let y = 0;

      for (y = 0; y < height; y += fontHeight) {
        const next = nextChar(renderText);
        ctx.fillStyle = (i === LIMITS.length - 1 && isKeyword(renderText, keyword)) ? END_COLOR : COLORS[i];
        ctx.fillText(next, x, y);
      }

      if (i === LIMITS.length - 1) {
        ctx.fillStyle = END_COLOR;
        ctx.fillText(nextChar(renderText), x, y);
      }
    }
  }
}

// Custom seeded RNG (simple & effective)
function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randBetween(r, min, max) {
  return Math.floor(r() * (max - min)) + min;
}

function nextChar(renderText) {
  if (index >= renderText.length) {
    index = 0;
  }
  return renderText.charAt(index++);
}

function isKeyword(renderText, keyword) {
  if (!keyword) return false;

  let i = -1;
  while (true) {
    i = renderText.indexOf(keyword, i + 1);
    if (i === -1) return false;
    if (index > i && index <= i + keyword.length) return true;
  }
}

function downloadImage() {
  const canvas = document.getElementById('myCanvas');
  const link = document.createElement('a');
  link.download = 'generated-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
