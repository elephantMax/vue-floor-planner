<script setup>
import { reactive, ref, computed, provide } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import CanvasGrid from './CanvasGrid.vue'
import { useStore } from 'vuex'
import FigureLayer from './Layers/FigureLayer.vue'
import CreateLayer from './Layers/CreateLayer.vue'
import { useDrawMode } from '../helpers/useDrawMode'

const konvaConfig = reactive({
  width: 600,
  height: 600,
})

const drawModeHelper = useDrawMode(konvaConfig)

const {
  createLayerRef,
  drawMode,
  mouseMoveEvent,
  markedPoints,
  createLayoutPoints,
} = drawModeHelper

const floorPlannerRef = ref(null)
const stageRef = ref(null)

const store = useStore()

useResizeObserver(floorPlannerRef, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  konvaConfig.width = width
  konvaConfig.height = height
})

function stageClickHandler() {
  store.commit('setSelectedLine', null)
}

function stageMouseDownHandler() {
  if (!drawMode.value) {
    return
  }
  mouseMoveEvent.active = true
}

function stageMouseUpHandler() {
  if (!drawMode.value) {
    return
  }
  mouseMoveEvent.active = false
  drawModeHelper.createCustomFigure()
}

const touchMoveHandler = (e) => {
  const { evt } = e
  const touch = evt.touches[0]
  const { clientX, clientY, radiusX, radiusY } = touch
  const { x, y } = getMousePosition({ clientX, clientY })
  const pressedPoint = drawModeHelper.getPressedPoint(x, y, radiusX, radiusY)
  if (!pressedPoint) {
    return
  }
  const target = getPointTarget(pressedPoint)
  if (target) {
    drawModeHelper.pushMarkedPoint(target, pressedPoint)
  }
}

function getMousePosition({ clientX, clientY }) {
  if (!stageRef.value) {
    return { x: 0, y: 0 }
  }
  const stage = stageRef.value.getStage()
  const { content } = stage
  const { x: offsetX, y: offsetY } = content.getBoundingClientRect()
  const xPos = clientX - offsetX
  const yPos = clientY - offsetY
  return { x: xPos, y: yPos }
}

function getPointTarget(point) {
  if (!point) {
    return null
  }
  const stage = stageRef.value?.getStage()
  if (!stage) {
    return null
  }
  return stage.findOne((element) => element.id() === point.id)
}

provide('pushPoint', drawModeHelper.pushMarkedPoint)
provide(
  'markedPoints',
  computed(() => markedPoints)
)
</script>

<template>
  <div class="floor-planner" ref="floorPlannerRef">
    <v-stage
      ref="stageRef"
      :config="konvaConfig"
      @click="stageClickHandler"
      @tap="stageClickHandler"
      @mousedown="stageMouseDownHandler"
      @mouseup="stageMouseUpHandler"
      @touchstart="stageMouseDownHandler"
      @touchend="stageMouseUpHandler"
      @touchmove="touchMoveHandler"
    >
      <v-layer>
        <CanvasGrid :width="konvaConfig.width" :height="konvaConfig.height" />
        <FigureLayer
          v-if="!drawMode"
          :width="konvaConfig.width"
          :height="konvaConfig.height"
        />
        <CreateLayer
          v-else
          ref="createLayerRef"
          :width="konvaConfig.width"
          :height="konvaConfig.height"
          :points="createLayoutPoints"
          :mouse-active="mouseMoveEvent.active"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<style lang="scss" scoped>
.floor-planner {
  width: 100%;
  height: 100%;
}
</style>
