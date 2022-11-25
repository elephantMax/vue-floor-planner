<script setup>
import { nextTick, reactive, ref } from 'vue'
import { Figure } from './models/Figure'
import { FigureType } from './models/FigureTypes'
import RectWrapper from './wrappers/RectWrapper.vue'
import { metersToPixels } from './helpers/metersToPixels'
import { pixelsToMeters } from './helpers/pixelsToMeters'

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
const input = ref(null)
const inputValue = ref(0)
const editable = ref(false)
const editableSize = ref(null)
const wrapper = ref(null)
const stage = ref(null)

const inputStyle = reactive({
  top: 0,
  left: 0,
})

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
  wrapper.value.render(cordsOfSelectedShape)
}

const getCordsOfFigureShape = () => {
  const node = getFigureShapeNode()

  if (!node) {
    return null
  }
  const { attrs } = node
  if (figure.value.type === FigureType.RECT) {
    return attrs
  } else if (figure.value.type === FigureType.T_FIGURE) {
    const transformerNode = transformer.value?.getNode()
    const width = transformerNode.width()
    const height = transformerNode.height()
    return {
      width,
      height,
      ...attrs,
    }
  }
  return {}
}

const dragMoveHandler = () => {
  renderWrapper()
}

const handleTransformEnd = (e) => {
  figure.value.x = e.target.x()
  figure.value.y = e.target.y()
  figure.value.rotation = e.target.rotation()
  figure.value.scaleX = e.target.scaleX()
  figure.value.scaleY = e.target.scaleY()
  renderWrapper()
}

const selectFigure = async (type) => {
  if (stage.value) {
    const stageNode = stage.value.getStage()
    stageNode.clear()
  }
  const newFigure = new Figure(type)
  figure.value = newFigure
  await nextTick()
  renderWrapper()
  updateTransformer()
}

const textClickHandler = async (e) => {
  selected.value = true
  editable.value = true
  await nextTick()
  const { content } = stage.value.getStage()
  const { x: offsetX, y: offsetY } = content.getBoundingClientRect()
  const { target, evt } = e
  const { clientX: x, clientY: y } = evt
  const height = target.height()
  const width = target.width()
  if (target.id() === 'top') {
    inputStyle.top = `${y - offsetY}px`
    inputStyle.left = `${x - offsetX}px`
    inputValue.value = pixelsToMeters(width)
    editableSize.value = 'top'
  } else {
    inputStyle.top = `${y - offsetY}px`
    inputStyle.left = `${x - offsetX}px`
    inputValue.value = pixelsToMeters(height)
    editableSize.value = 'right'
  }
  input.value.focus()
  input.value.select()
}

const updateSize = () => {
  const selectedNode = getFigureShapeNode()
  const pixels = metersToPixels(inputValue.value)
  if (editableSize.value === 'top') {
    selectedNode.width(pixels)
  } else {
    selectedNode.height(pixels)
  }
  editable.value = false
  editableSize.value = null
  renderWrapper()
}

selectFigure(FigureType.RECT)
defineExpose({ selectFigure })
</script>

<template>
  <input
    v-if="editable && selected"
    v-model="inputValue"
    ref="input"
    type="number"
    class="input"
    :style="inputStyle"
    @keydown.enter="updateSize"
    @blur="editable = false"
  />
  <v-stage
    ref="stage"
    :config="konvaConfig"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer>
      <RectWrapper ref="wrapper" @text-click="textClickHandler" />
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
