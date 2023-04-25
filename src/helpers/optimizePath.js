function optimizePath(points) {
  const res = [points[0]]
  let start = 0
  let center = 1
  let end = 2

  while (end < points.length) {
    const isCenterOnLine = isPointOnLine(
      points[start],
      points[end],
      points[center]
    )
    if (!isCenterOnLine) {
      res.push(points[center])
    }
    start++
    center++
    end++
  }
  const isLastPointOnLine = isPointOnLine(points[start], res[0], points[center])
  if (!isLastPointOnLine) {
    res.push(points[center])
  }
  return res
}

function isPointOnLine(start, end, center) {
  return (
    (center.y - start.y) * (end.x - start.x) ===
    (end.y - start.y) * (center.x - start.x)
  )
}

export { optimizePath, isPointOnLine }
