import { reactive } from 'vue'
import { createCircles, createLinesFromCircles } from './createCircle'

const points = [50, 50, 150, 50, 150, 150, 50, 150]

const useRectConfig = () => {
  const initCircles = createCircles(points)
  const circles = reactive(initCircles)
  const lines = reactive(createLinesFromCircles(circles))
  return { circles, lines }
}

export { useRectConfig }
