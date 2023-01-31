const calcHypo = (line) => {
  const { xDiff, yDiff } = getLineData(line)
  return Math.sqrt(xDiff ** 2 + yDiff ** 2)
}

const getLineData = (line) => {
  const { config } = line
  const { points } = config
  const start = points.slice(0, 2)
  const end = points.slice(2)
  const xDiff = start[0] - end[0]
  const yDiff = start[1] - end[1]
  return {
    xDiff,
    yDiff,
  }
}

export { calcHypo, getLineData }
