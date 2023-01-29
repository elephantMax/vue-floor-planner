import { reactive, ref, computed } from '@vue/reactivity'
import { pixelsToMeters } from './pixelsToMeters'
const LINE_STROKE = '#000'
const SELECTED_LINE_STROKE = '#faea00'

const useRect = () => {
  const baseCircleConfig = {
    fill: '#fff',
    radius: 10,
    draggable: true,
  }

  const leftTopCircle = reactive({
    ...baseCircleConfig,
    x: 50,
    y: 50,
  })

  const rightTopCircle = reactive({
    ...baseCircleConfig,
    x: 150,
    y: 50,
  })

  const leftBottomCircle = reactive({
    ...baseCircleConfig,
    x: 50,
    y: 150,
  })

  const rightBottomCircle = reactive({
    ...baseCircleConfig,
    x: 150,
    y: 150,
  })

  const selectedLineId = ref(null)

  const baseLineConfig = {
    stroke: LINE_STROKE,
    strokeWidth: 5,
  }

  const circles = reactive([
    leftTopCircle,
    rightTopCircle,
    rightBottomCircle,
    leftBottomCircle,
  ])

  const lines = computed(() => {
    const topCircles = {
      id: 'top',
      circles: [leftTopCircle, rightTopCircle],
    }
    const bottomCircles = {
      id: 'bottom',
      circles: [leftBottomCircle, rightBottomCircle],
    }
    const leftCircles = {
      id: 'left',
      circles: [leftTopCircle, leftBottomCircle],
    }
    const rightCircles = {
      id: 'right',
      circles: [rightTopCircle, rightBottomCircle],
    }

    return [topCircles, bottomCircles, leftCircles, rightCircles].map(
      (group) => {
        const { id, circles } = group
        const [left, right] = circles
        const stroke =
          id === selectedLineId.value ? SELECTED_LINE_STROKE : LINE_STROKE
        return {
          ...baseLineConfig,
          stroke,
          id,
          points: [left.x, left.y, right.x, right.y],
        }
      }
    )
  })

  const topTextConfig = computed(() => {
    const { x, y } = position.value
    const { width } = fullSize.value

    return {
      x,
      y: y - 30,
      text: width,
      align: 'center',
      width,
      fill: '#000',
    }
  })

  const bottomTextConfig = computed(() => {
    const { x, y } = position.value
    const { height, width } = fullSize.value

    return {
      x,
      y: height + y + 20,
      text: width,
      align: 'center',
      width,
      fill: '#000',
    }
  })

  const leftTextConfig = computed(() => {
    const { x, y } = position.value
    const { height } = fullSize.value

    return {
      x: x - 40,
      y: y + height / 2 - 10,
      text: height,
      align: 'center',
      fill: '#000',
    }
  })

  const rightTextConfig = computed(() => {
    const { x, y } = position.value
    const { height, width } = fullSize.value

    return {
      x: x + width + 20,
      y: y + height / 2 - 10,
      text: height,
      align: 'center',
      fill: '#000',
    }
  })

  const borderTextConfigs = computed(() => {
    return [
      topTextConfig.value,
      bottomTextConfig.value,
      leftTextConfig.value,
      rightTextConfig.value,
    ]
  })

  const lineSizesTextConfigs = computed(() => {
    const PADDING = 30
    const FONT_SIZE = 20
    return lines.value.map((line) => {
      const { id, points } = line
      const [startX, startY, endX, endY] = points
      const x = Math.abs(startX + endX) / 2
      const y = Math.abs(startY + endY) / 2
      const length = getLineLength(line)
      const lengthInMeters = pixelsToMeters(length).toFixed(2)
      const width = lengthInMeters.length * FONT_SIZE
      const padding = {
        x: 0,
        y: 0,
      }
      if (id === 'right') {
        padding.x += PADDING
      } else if (id === 'left') {
        padding.x -= PADDING
      } else if (id === 'top') {
        padding.y -= PADDING
      } else if (id === 'bottom') {
        padding.y += PADDING
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
    const xPositions = circles.map((c) => c.x)
    const xDifferences = xPositions
      .map((x) => xPositions.map((x2) => Math.abs(x - x2)))
      .flat()
    const width = +Math.max(...xDifferences).toFixed(2)

    const yPositions = circles.map((c) => c.y)
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
    const xPositions = circles.map((c) => c.x)
    const yPositions = circles.map((c) => c.y)
    const x = Math.min(...xPositions)
    const y = Math.min(...yPositions)
    return { x, y }
  })

  const selectedLine = computed(() => {
    return lines.value.find((l) => l.id === selectedLineId.value)
  })

  const selectedLineLength = computed(() => {
    if (!selectedLine.value) {
      return 0
    }
    return getLineLength(selectedLine.value)
  })

  const updateLineSize = (line, value) => {
    if (!value) {
      return
    }
    const { id } = line
    const { xDiff, yDiff } = getLineData(line)
    const lineLength = getLineLength(line)
    const additionalPercent = value / lineLength
    const resX = xDiff * additionalPercent
    const resY = yDiff * additionalPercent
    const resXDiff = xDiff - resX
    const resYDiff = yDiff - resY
    if (id === 'left') {
      leftBottomCircle.x += resXDiff
      leftBottomCircle.y += resYDiff
    } else if (id === 'right') {
      rightBottomCircle.x += resXDiff
      rightBottomCircle.y += resYDiff
    } else if (id === 'top') {
      rightTopCircle.x += resXDiff
      rightTopCircle.y += resYDiff
    } else {
      rightBottomCircle.x += resXDiff
      rightBottomCircle.y += resYDiff
    }
  }

  const getLineLength = (line) => {
    const { xDiff, yDiff } = getLineData(line)
    return Math.sqrt(xDiff ** 2 + yDiff ** 2)
  }

  const getLineData = (line) => {
    const { points } = line
    const start = points.slice(0, 2)
    const end = points.slice(2)
    const xDiff = start[0] - end[0]
    const yDiff = start[1] - end[1]
    return {
      xDiff,
      yDiff,
    }
  }

  return {
    lines,
    circles,
    fullSize,
    position,
    selectedLine,
    selectedLineId,
    selectedLineLength,
    borderTextConfigs,
    lineSizesTextConfigs,
    updateLineSize,
    getLineLength,
  }
}

export { useRect }
