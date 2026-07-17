/**
 * Generates a GitHub-style identicon as a data URL.
 * Mirrors the exact logic from your Kotlin implementation for UI consistency.
 * 
 * @param name - The unique string to hash (e.g., username or email)
 * @param colorHex - The base color as a hex string (e.g., "#F0060B")
 * @param size - The canvas size in pixels (default 200)
 * @returns A data URL string ready to use in <img> src
 */
export function generateIdenticon(
  name: string,
  colorHex: string,
  size: number = 200
): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Convert hex color to RGB components for lighter variations
  const baseColor = hexToRgb(colorHex);
  ctx.fillStyle = colorHex;

  const cellSize = size / 5;
  const hash = hashString(name);

  // 5x5 grid, mirrored on the left half (exactly as in your Kotlin code)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) { // only left half (columns 0,1,2)
      const bitIndex = row * 5 + col;
      const bit = (hash >>> bitIndex) & 1;

      if (bit === 1) {
        // Draw block at (col, row)
        const left = col * cellSize;
        const top = row * cellSize;
        ctx.fillRect(left, top, cellSize, cellSize);

        // Mirror to the right side (except middle column)
        if (col !== 2) {
          const mirroredLeft = (4 - col) * cellSize;
          ctx.fillRect(mirroredLeft, top, cellSize, cellSize);
        }
      }
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * Simple string hash function (mimics Java/Kotlin hashCode behavior)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Converts hex color to RGB object (useful if you want lighter/darker variations)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 128, g: 128, b: 128 }; // fallback gray
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Generates a color from a string (for when you don't have an instrument ID)
 * This uses a similar approach to your instrumentColor function
 */
export function stringToColor(str: string): string {
  const hash = hashString(str);
  // Use HSL for vibrant, saturated colors like your gradient
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
}