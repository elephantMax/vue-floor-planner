import { computed, reactive } from 'vue'
import { FigureType } from '../enums/FigureTypes'
import { chunk } from 'lodash'
import uniqid from 'uniqid'

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

const defaultState = () => ({
  circles: [],
  lines: [],
  figureType: null,
})

const defaultFigurePoints = {
  [FigureType.RECT]: [50, 50, 250, 50, 250, 250, 50, 250],
  [FigureType.T_FIGURE]: [
    50, 50, 350, 50, 350, 150, 250, 150, 250, 350, 150, 350, 150, 150, 50, 150,
  ],
  [FigureType.L_FIGURE]: [
    50, 50, 50, 450, 150, 450, 150, 150, 350, 150, 350, 50,
  ],
}

const useFigureConfig = () => {
  const state = reactive(defaultState())

  const setFigure = (type = FigureType.RECT) => {
    clear()
    state.figureType = type
    const points = defaultFigurePoints[type] || []
    state.circles = createCircles(points)
    state.lines = createLinesFromCircles(state.circles)
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

  const clear = () => {
    Object.assign(state, defaultState())
  }

  return {
    circles: computed(() => state.circles),
    lines: computed(() => state.lines),
    setFigure,
    clear,
  }
}

export { useFigureConfig }
