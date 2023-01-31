import { chunk } from 'lodash'
import uniqid from 'uniqid'
import { reactive } from 'vue'
const LINE_STROKE = '#000'

const baseCircleConfig = {
  fill: '#fff',
  radius: 10,
  draggable: true,
}

const baseLineConfig = {
  stroke: LINE_STROKE,
  strokeWidth: 5,
}

const createCircle = (x, y) => {
  return reactive({
    ...baseCircleConfig,
    x,
    y,
  })
}

const createCircles = (points) => {
  return chunk(points, 2).reduce((acc, chunk) => {
    const [x, y] = chunk
    const start = createCircle(x, y)
    return [...acc, start]
  }, [])
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

export { createCircle, createLinesFromCircles, createCircles }
