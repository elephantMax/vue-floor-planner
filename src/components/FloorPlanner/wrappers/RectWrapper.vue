<script setup>
import { pixelsToMeters } from '.././helpers/pixelsToMeters'
import { reactive } from 'vue'

const SIZE_LINES_HEIGHT = 15
const TEXT_GAP = 30
const ARROW_OFFSET = 10
const LINE_GAP = 15

const emit = defineEmits(['text-click'])

const wrapperConfig = reactive({})

const textConfig = {
  draggable: false,
  fill: '#555',
  fontSize: 15,
  fontFamily: 'Calibri',
}

const topTextConfig = reactive({
  id: 'top',
  text: pixelsToMeters(100),
  align: 'center',
  y: -TEXT_GAP,
  ...textConfig,
})

const bottomTextConfig = reactive({
  id: 'top',
  text: pixelsToMeters(100),
  align: 'center',
  y: -TEXT_GAP,
  ...textConfig,
})

const rightTextConfig = reactive({
  id: 'right',
  text: pixelsToMeters(100),
  verticalAlign: 'middle',
  ...textConfig,
})

const leftTextConfig = reactive({
  id: 'right',
  text: pixelsToMeters(100),
  verticalAlign: 'middle',
  x: -TEXT_GAP,
  ...textConfig,
})

const customShapeConfig = reactive({
  sceneFunc: () => {},
  stroke: 'gray',
})

const drawTopSizeLine = (context, cords) => {
  const { x, y, width } = cords
  const topLeftLineY = y - LINE_GAP
  context.moveTo(x, topLeftLineY)
  context.lineTo(x, topLeftLineY + SIZE_LINES_HEIGHT)

  // Right Top Line
  const topRightLineX = x + width
  context.moveTo(topRightLineX, topLeftLineY)
  context.lineTo(topRightLineX, topLeftLineY + SIZE_LINES_HEIGHT)

  // Middle Top Line
  const topMiddleY = topLeftLineY + SIZE_LINES_HEIGHT / 2
  context.moveTo(x, topMiddleY)
  context.lineTo(topRightLineX, topMiddleY)

  // Left Arrow
  const leftArrowEndX = x + ARROW_OFFSET
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY)

  // Right Arrow
  const rightArrowEndX = topRightLineX - ARROW_OFFSET
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY)
}

const drawBottomSizeLine = (context, cords) => {
  const { x, y, width, height } = cords

  // Left Bot Line
  const topLeftLineY = y + height
  context.moveTo(x, topLeftLineY)
  context.lineTo(x, topLeftLineY + SIZE_LINES_HEIGHT)

  // Right Top Line
  const topRightLineX = x + width
  context.moveTo(topRightLineX, topLeftLineY)
  context.lineTo(topRightLineX, topLeftLineY + SIZE_LINES_HEIGHT)

  // Middle Top Line
  const topMiddleY = topLeftLineY + SIZE_LINES_HEIGHT / 2
  context.moveTo(x, topMiddleY)
  context.lineTo(topRightLineX, topMiddleY)

  // Left Arrow
  const leftArrowEndX = x + ARROW_OFFSET
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY)

  // Right Arrow
  const rightArrowEndX = topRightLineX - ARROW_OFFSET
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY)
}

const drawLeftSizeLine = (context, cords) => {
  const { x, y, height } = cords

  const minX = x - LINE_GAP
  const maxY = y + height
  const middleX = x - LINE_GAP / 2

  context.moveTo(minX, y)
  context.lineTo(x, y)

  context.moveTo(minX, y + height)
  context.lineTo(x, y + height)

  context.moveTo(middleX, y)
  context.lineTo(middleX, maxY)

  context.moveTo(middleX, y)
  context.lineTo(minX, y + ARROW_OFFSET)

  context.moveTo(middleX, y)
  context.lineTo(x, y + ARROW_OFFSET)

  context.moveTo(middleX, maxY)
  context.lineTo(x, maxY - ARROW_OFFSET)

  context.moveTo(middleX, maxY)
  context.lineTo(minX, maxY - ARROW_OFFSET)
}

const drawRightSizeLine = (context, cords) => {
  const { x, y, width, height } = cords
  const minX = x + width
  const maxX = minX + LINE_GAP
  const maxY = y + height
  const minY = y
  const middleX = minX + LINE_GAP / 2

  context.moveTo(minX, minY)
  context.lineTo(maxX, minY)

  context.moveTo(minX, minY + height)
  context.lineTo(maxX, minY + height)

  context.moveTo(middleX, minY)
  context.lineTo(middleX, maxY)

  context.moveTo(middleX, minY)
  context.lineTo(minX, minY + ARROW_OFFSET)

  context.moveTo(middleX, minY)
  context.lineTo(maxX, minY + ARROW_OFFSET)

  context.moveTo(middleX, maxY)
  context.lineTo(maxX, maxY - ARROW_OFFSET)

  context.moveTo(middleX, maxY)
  context.lineTo(minX, maxY - ARROW_OFFSET)
}

const render = (properties) => {
  const { width, height } = properties
  Object.assign(wrapperConfig, properties, {
    draggable: false,
    id: 'group',
  })
  Object.assign(customShapeConfig, {
    width,
    height,
  })
  Object.assign(topTextConfig, {
    width,
  })
  Object.assign(rightTextConfig, {
    height,
    x: width + TEXT_GAP / 2,
  })
  Object.assign(bottomTextConfig, {
    width,
    y: height + TEXT_GAP / 2,
  })
  Object.assign(leftTextConfig, {
    height,
  })
  customShapeConfig.sceneFunc = (context, shape) => {
    context.beginPath()
    const cords = {
      ...shape.attrs,
      x: 0,
      y: 0,
    }
    drawTopSizeLine(context, cords)
    drawBottomSizeLine(context, cords)
    drawLeftSizeLine(context, cords)
    drawRightSizeLine(context, cords)
    context.closePath()
    context.fillStrokeShape(shape)
  }
  const widthMeters = pixelsToMeters(width)
  const heightMeters = pixelsToMeters(height)
  topTextConfig.text = widthMeters
  bottomTextConfig.text = widthMeters
  rightTextConfig.text = heightMeters
  leftTextConfig.text = heightMeters
}

const textClick = (e) => {
  emit('text-click', e)
}

defineExpose({ render })
</script>

<template>
  <v-group :config="wrapperConfig">
    <v-text :config="topTextConfig" @click="textClick" />
    <v-text :config="bottomTextConfig" @click="textClick" />
    <v-text :config="rightTextConfig" @click="textClick" />
    <v-text :config="leftTextConfig" @click="textClick" />
    <v-shape ref="custom" :config="customShapeConfig" />
  </v-group>
</template>
