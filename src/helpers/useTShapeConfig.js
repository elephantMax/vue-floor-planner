import { reactive } from 'vue'
import { createCircles, createLinesFromCircles } from './createCircle'

const points = [
  50, 50, 350, 50, 350, 150, 250, 150, 250, 350, 150, 350, 150, 150, 50, 150,
]

const useTShapeConfig = () => {
  const initCircles = createCircles(points)
  const circles = reactive(initCircles)
  const lines = reactive(createLinesFromCircles(circles))
  return { circles, lines }
}

export { useTShapeConfig }
