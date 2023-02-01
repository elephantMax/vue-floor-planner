import { circlesToPoints } from './getFigureConfig'

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

const calcLinesLength = (lines) => {
  return lines.reduce((acc, line) => {
    const hypo = calcHypo(line) || 0
    return acc + hypo
  }, 0)
}

const setLineLength = (line, length) => {
  const { circles, config } = line
  const { xDiff, yDiff } = getLineData(line)
  const lineLength = calcHypo(line)
  const additionalPercent = length / lineLength
  const resX = xDiff * additionalPercent
  const resY = yDiff * additionalPercent
  const resXDiff = xDiff - resX
  const resYDiff = yDiff - resY
  const { end } = circles
  end.x += resXDiff
  end.y += resYDiff
  config.points = circlesToPoints(circles)
  return line
}

export { calcHypo, getLineData, calcLinesLength, setLineLength }
