<script setup>
import { reactive, ref, computed } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import CanvasGrid from './CanvasGrid.vue'
import { useStore } from 'vuex'
import FigureLayer from './Layers/FigureLayer.vue'
import CreateLayer from './Layers/CreateLayer.vue'

const konvaConfig = reactive({
  width: 600,
  height: 600,
})

const floorPlannerRef = ref(null)
const stageRef = ref(null)
const createLayerRef = ref(null)
const mouseMoveEvent = reactive({
  active: false,
})

const store = useStore()

const drawMode = computed(() => {
  return store.getters['drawMode']
})

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
  const pointObjects = createLayerRef.value.getMarkedPoints()
  if (pointObjects.length < 3) {
    return
  }
  createCustomFigure(pointObjects)
}

const createCustomFigure = (points) => {
  const arrayOfPoints = points.reduce((acc, { x, y }) => {
    return [...acc, x, y]
  }, [])
  store.dispatch('setCustomFigure', arrayOfPoints)
}

function getMousePosition(e) {
  if (!stageRef.value) {
    return { x: 0, y: 0 }
  }
  const stage = stageRef.value.getStage()
  const { content } = stage
  const { x: offsetX, y: offsetY } = content.getBoundingClientRect()
  const { clientX, clientY } = e.evt
  const xPos = clientX - offsetX
  const yPos = clientY - offsetY
  return { x: xPos, y: yPos }
}
</script>

<template>
  <div class="floor-planner" ref="floorPlannerRef">
    <v-stage
      ref="stageRef"
      :config="konvaConfig"
      @click="stageClickHandler"
      @mousedown="stageMouseDownHandler"
      @mouseup="stageMouseUpHandler"
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
          :mouse-active="mouseMoveEvent.active"
          @limit="createCustomFigure"
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
