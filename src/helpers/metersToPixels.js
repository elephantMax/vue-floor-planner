export const metersToPixels = (meters) => {
  // 100px = 1m
  return +(meters * 100).toFixed(2)
}
