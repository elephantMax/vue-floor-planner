import { ref, computed } from '@vue/reactivity'
import { pixelsToMeters } from './pixelsToMeters'
import { getLineData, calcHypo } from './lineHelper'
import { useFigureConfig } from './useFigureConfig'

const useFigure = () => {
  const selectedLineId = ref(null)

  const { circles, lines, clear, setFigure } = useFigureConfig(null)

  const lineSizesTextConfigs = computed(() => {
    const PADDING = 30
    const FONT_SIZE = 20
    return lines.value.map((line) => {
      const { config, circles } = line
      const { id } = config
      const { start, end } = circles
      const x = (start.x + end.x) / 2
      const y = (start.y + end.y) / 2
      const length = calcHypo(line)
      const lengthInMeters = pixelsToMeters(length).toFixed(2)
      const width = lengthInMeters.length * FONT_SIZE
      const padding = {
        x: 0,
        y: 0,
      }
      return {
        x: x + padding.x - width / 2,
        y: y + padding.y - FONT_SIZE / 2,
        text: lengthInMeters,
        width,
        fontSize: FONT_SIZE,
        align: 'center',
        fill: '#fff',
        lineId: id,
      }
    })
  })

  const fullSize = computed(() => {
    const xPositions = circles.value.map((c) => c.x)
    const xDifferences = xPositions
      .map((x) => xPositions.map((x2) => Math.abs(x - x2)))
      .flat()
    const width = +Math.max(...xDifferences).toFixed(2)

    const yPositions = circles.value.map((c) => c.y)
    const yDifferences = yPositions
      .map((y) => yPositions.map((y2) => Math.abs(y - y2)))
      .flat()

    const height = +Math.max(...yDifferences).toFixed(2)
    return {
      width,
      height,
    }
  })

  const position = computed(() => {
    const xPositions = circles.value.map((c) => c.x)
    const yPositions = circles.value.map((c) => c.y)
    const x = Math.min(...xPositions)
    const y = Math.min(...yPositions)
    return { x, y }
  })

  const selectedLine = computed(() => {
    return lines.value.find((l) => l.config.id === selectedLineId.value)
  })

  const selectedLineLength = computed({
    get() {
      if (!selectedLine.value) {
        return 0
      }
      return calcHypo(selectedLine.value)
    },
    set(value) {
      updateLineSize(selectedLine.value, value)
    },
  })

  const groupConfig = computed(() => {
    const { width, height } = fullSize.value
    const { x, y } = position.value
    return {
      x: x - 10,
      y: y - 10,
      stroke: 'black',
      strokeWidth: 1,
      width: width + 20,
      height: height + 20,
      draggable: true,
    }
  })

  const updateLineSize = (line, value) => {
    if (!value) {
      return
    }
    const { circles } = line
    const { xDiff, yDiff } = getLineData(line)
    const lineLength = calcHypo(line)
    const additionalPercent = value / lineLength
    const resX = xDiff * additionalPercent
    const resY = yDiff * additionalPercent
    const resXDiff = xDiff - resX
    const resYDiff = yDiff - resY
    const { end } = circles
    end.x += resXDiff
    end.y += resYDiff
    updateLinesPosition()
  }

  const updateLinesPosition = () => {
    lines.value.forEach((line) => {
      const { config, circles } = line
      const { start, end } = circles
      config.points = [start.x, start.y, end.x, end.y]
    })
  }

  return {
    lines,
    circles,
    fullSize,
    position,
    selectedLine,
    selectedLineId,
    selectedLineLength,
    lineSizesTextConfigs,
    groupConfig,
    updateLineSize,
    updateLinesPosition,
    clear,
    setFigure,
  }
}

export { useFigure }
