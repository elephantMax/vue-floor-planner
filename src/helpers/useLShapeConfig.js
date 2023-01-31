import { reactive } from 'vue'
import { createCircles, createLinesFromCircles } from './createCircle'

const points = [50, 50, 50, 450, 150, 450, 150, 150, 350, 150, 350, 50]

const useLShapeConfig = () => {
  const initCircles = createCircles(points)
  const circles = reactive(initCircles)
  const lines = reactive(createLinesFromCircles(circles))
  return { circles, lines }
}

export { useLShapeConfig }
