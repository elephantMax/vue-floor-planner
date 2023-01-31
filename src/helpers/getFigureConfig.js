import { reactive } from 'vue'
import { FigureType } from '../enums/FigureTypes'
import { chunk } from 'lodash'
import uniqid from 'uniqid'
import { baseCircleConfig, baseLineConfig } from '../enums/constants'

const configGetters = {
  [FigureType.RECT]: () => [50, 50, 250, 50, 250, 250, 50, 250],
  [FigureType.T_FIGURE]: () => [
    50, 50, 350, 50, 350, 150, 250, 150, 250, 350, 150, 350, 150, 150, 50, 150,
  ],
  [FigureType.L_FIGURE]: () => [
    50, 50, 50, 450, 150, 450, 150, 150, 350, 150, 350, 50,
  ],
  [FigureType.CUSTOM]: () => [],
}

const getFigureConfig = (type) => {
  const points = configGetters[type]() || []
  const circles = createCircles(points)
  const lines = createLinesFromCircles(circles)
  return {
    type,
    circles,
    lines,
  }
}

const createCircles = (points) => {
  return chunk(points, 2).reduce((acc, chunk) => {
    const [x, y] = chunk
    const start = createCircle(x, y)
    return [...acc, start]
  }, [])
}

const createCircle = (x, y) => {
  return reactive({
    ...baseCircleConfig,
    id: uniqid(),
    x,
    y,
  })
}

const createLinesFromCircles = (circles) => {
  return circles.map((start, index) => {
    const end = circles[index + 1] || circles[0]
    const id = uniqid()
    return {
      config: {
        ...baseLineConfig,
        id,
        points: [start.x, start.y, end.x, end.y],
      },
      circles: {
        start,
        end,
      },
    }
  })
}

export { getFigureConfig }
