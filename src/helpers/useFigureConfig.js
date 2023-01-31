import { useRectConfig } from './useRectConfig'
import { useTShapeConfig } from './useTShapeConfig'
import { useLShapeConfig } from './useLShapeConfig'

const useFigureConfig = (figureType) => {
  const { circles, lines } = useLShapeConfig()

  const clear = () => {
    circles.length = 0
    lines.length = 0
  }

  return {
    circles,
    lines,
    clear,
  }
}

export { useFigureConfig }
