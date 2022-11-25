export const pixelsToMeters = (pixels) => {
  // 100px = 1m
  return +(pixels / 100).toFixed(2)
}
