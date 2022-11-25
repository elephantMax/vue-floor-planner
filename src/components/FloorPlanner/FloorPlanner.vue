<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { Figure } from './models/Figure'
import { FigureType } from './models/FigureTypes'

const SIZE_LINES_HEIGHT = 15

const konvaConfig = reactive({
  width: 600,
  height: 600,
})

const transformerConfig = reactive({
  resizeEnabled: false,
  keepRatio: true,
})

const figure = ref()
const selected = ref(false)
const transformer = ref(null)
const custom = ref(null)
const input = ref(null)
const inputValue = ref(0)
const canEdit = ref(false)
const editableSize = ref(null)

onMounted(() => {
  renderWrapper()
})

const pixelsToMeters = (pixels) => {
  // 100px = 1m
  return +(pixels / 100).toFixed(2)
}

const metersToPixels = (meters) => {
  // 100px = 1m
  return +(meters * 100).toFixed(2)
}

const handleStageMouseDown = (e) => {
  //clicked on stage - clear selection
  if (e.target === e.target.getStage()) {
    if (editableSize.value) {
      updateSize()
    }
    selected.value = false
    return updateTransformer()
  }

  // clicked on transformer - do nothing
  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) {
    return
  }

  const sizeLines = ['top', 'right']

  if (sizeLines.includes(e.target.id())) {
    return
  }

  const id = e.target.id()
  selected.value = figure.value.id === id
  renderWrapper()
  updateTransformer()
}

const updateTransformer = () => {
  const selectedNode = getSelectedShapeNode()
  const transformerNode = transformer.value?.getNode()
  if (!transformerNode) {
    return
  }
  if (selectedNode === transformerNode.node()) {
    return
  }
  if (selectedNode) {
    // attach to another node
    transformerNode.nodes([selectedNode])
  } else {
    // remove transformer
    transformerNode.nodes([])
  }
}

const getFigureShapeNode = () => {
  const transformerNode = transformer.value?.getNode()
  if (!transformerNode) {
    return null
  }
  const stage = transformerNode.getStage()
  return stage.findOne((node) => {
    return node.id() === figure.value?.id
  })
}

const getSelectedShapeNode = () => {
  if (!selected.value) {
    return null
  }
  return getFigureShapeNode()
}

const renderWrapper = () => {
  if (!figure.value) {
    return
  }
  const cordsOfSelectedShape = getCordsOfFigureShape()
  if (!cordsOfSelectedShape) {
    return
  }
  synchronizeFigure()
  drawWrapper()
}

const synchronizeFigure = () => {
  const figureNode = getFigureShapeNode()
  Object.assign(wrapperConfig, figureNode.attrs, {
    draggable: false,
    id: 'group',
  })

  const { width, height } = figureNode.attrs
  Object.assign(customShapeConfig, {
    width,
    height,
  })
  Object.assign(topTextConfig, {
    width,
  })
  Object.assign(rightTextConfig, {
    height,
    x: width + 15,
  })
}

const getCordsOfFigureShape = () => {
  const node = getFigureShapeNode()
  if (!node) {
    return null
  }
  const { attrs } = node
  return attrs
}

const dragMoveHandler = () => {
  renderWrapper()
}

const drawWrapper = () => {
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
}

const handleTransformEnd = (e) => {
  figure.value.x = e.target.x()
  figure.value.y = e.target.y()
  figure.value.rotation = e.target.rotation()
  figure.value.scaleX = e.target.scaleX()
  figure.value.scaleY = e.target.scaleY()
  renderWrapper()
}

const selectFigure = (type) => {
  const newFigure = new Figure(type)
  figure.value = newFigure
  updateTransformer()
}

const customShapeConfig = reactive({
  sceneFunc: () => {},
  stroke: 'gray',
})

const drawTopSizeLine = (context, cords) => {
  const paddingBottom = 15
  const arrowEndOffsetX = 10
  const { x, y, width } = cords
  const topLeftLineY = y - paddingBottom
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
  const leftArrowEndX = x + arrowEndOffsetX
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY)

  // Right Arrow
  const rightArrowEndX = topRightLineX - arrowEndOffsetX
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY)
}

const drawBottomSizeLine = (context, cords) => {
  const arrowEndOffsetX = 10
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
  const leftArrowEndX = x + arrowEndOffsetX
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(x, topMiddleY)
  context.lineTo(leftArrowEndX, topLeftLineY)

  // Right Arrow
  const rightArrowEndX = topRightLineX - arrowEndOffsetX
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY + SIZE_LINES_HEIGHT)
  context.moveTo(topRightLineX, topMiddleY)
  context.lineTo(rightArrowEndX, topLeftLineY)
}

const drawLeftSizeLine = (context, cords) => {
  const arrowOffset = 10
  const paddingLeft = 15
  const { x, y, width, height } = cords

  const minX = x - paddingLeft
  const maxY = y + height
  const middleX = x - paddingLeft / 2

  context.moveTo(minX, y)
  context.lineTo(x, y)

  context.moveTo(minX, y + height)
  context.lineTo(x, y + height)

  context.moveTo(middleX, y)
  context.lineTo(middleX, maxY)

  context.moveTo(middleX, y)
  context.lineTo(minX, y + arrowOffset)

  context.moveTo(middleX, y)
  context.lineTo(x, y + arrowOffset)

  context.moveTo(middleX, maxY)
  context.lineTo(x, maxY - arrowOffset)

  context.moveTo(middleX, maxY)
  context.lineTo(minX, maxY - arrowOffset)
}

const drawRightSizeLine = (context, cords) => {
  const arrowOffset = 10
  const paddingLeft = 15
  const { x, y, width, height } = cords

  const minX = x + width
  const maxX = minX + paddingLeft
  const maxY = y + height
  const minY = y
  const middleX = minX + paddingLeft / 2

  context.moveTo(minX, minY)
  context.lineTo(maxX, minY)

  context.moveTo(minX, minY + height)
  context.lineTo(maxX, minY + height)

  context.moveTo(middleX, minY)
  context.lineTo(middleX, maxY)

  context.moveTo(middleX, minY)
  context.lineTo(minX, minY + arrowOffset)

  context.moveTo(middleX, minY)
  context.lineTo(maxX, minY + arrowOffset)

  context.moveTo(middleX, maxY)
  context.lineTo(maxX, maxY - arrowOffset)

  context.moveTo(middleX, maxY)
  context.lineTo(minX, maxY - arrowOffset)
}

const topTextConfig = reactive({
  id: 'top',
  text: pixelsToMeters(100),
  fontFamily: 'Calibri',
  fill: 'green',
  align: 'center',
  fontSize: 15,
  fill: '#555',
  y: -30,
  draggable: false,
})

const rightTextConfig = reactive({
  id: 'right',
  text: pixelsToMeters(100),
  fontFamily: 'Calibri',
  fontSize: 15,
  fill: '#555',
  verticalAlign: 'middle',
  draggable: false,
})

const sizeClick = async (e) => {
  selected.value = true
  canEdit.value = true
  await nextTick()
  const { target } = e
  const { x, y } = target.getAbsolutePosition()
  const height = target.height()
  const width = target.width()
  const padding = 15
  if (target.id() === 'top') {
    inputStyle.top = `${y - 30}px`
    inputStyle.left = `${x + width / 2 - padding}px`
    inputValue.value = pixelsToMeters(width)
    editableSize.value = 'top'
  } else {
    inputStyle.top = `${y + height / 2 - padding}px`
    inputStyle.left = `${x + 30}px`
    inputValue.value = pixelsToMeters(height)
    editableSize.value = 'right'
  }
  input.value.focus()
  input.value.select()
}

const wrapperConfig = reactive({})

const inputStyle = reactive({
  top: 0,
  left: 0,
})

const updateSize = () => {
  const selectedNode = getFigureShapeNode()
  const pixels = metersToPixels(inputValue.value)
  const meters = inputValue.value
  if (editableSize.value === 'top') {
    selectedNode.width(pixels)
    topTextConfig.text = meters
  } else {
    selectedNode.height(pixels)
    rightTextConfig.text = meters
  }
  renderWrapper()
  canEdit.value = false
  editableSize.value = null
}

selectFigure(FigureType.RECT)
defineExpose({ selectFigure })
</script>

<template>
  <input
    v-if="canEdit && selected"
    v-model="inputValue"
    ref="input"
    type="number"
    class="input"
    :style="inputStyle"
    @keydown.enter="updateSize"
  />
  <v-stage
    :config="konvaConfig"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer>
      <v-group :config="wrapperConfig">
        <v-text :config="topTextConfig" @click="sizeClick" />
        <v-text :config="rightTextConfig" @click="sizeClick" />
        <v-shape ref="custom" :config="customShapeConfig" />
      </v-group>
      <component
        v-if="figure"
        :is="figure.component"
        :config="figure.config"
        @transformend="handleTransformEnd"
        @dragmove="dragMoveHandler"
      />
      <v-transformer ref="transformer" v-bind="transformerConfig" />
    </v-layer>
  </v-stage>
</template>

<style lang="scss">
.input {
  position: absolute;
  z-index: 999;
  width: fit-content;
  max-width: 30px;
}
</style>
