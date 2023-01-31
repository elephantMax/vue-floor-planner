<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import { calcLinesLength } from '../helpers/lineHelper'
import { useResizeObserver } from '@vueuse/core'
import FloorPlannerInputBox from './FloorPlannerInputBox.vue'
import CanvasLine from './CanvasLine.vue'
import { pixelsToMeters } from '../helpers/pixelsToMeters'
import CanvasGrid from './CanvasGrid.vue'
import { baseCircleConfig, GRID_CELL_SIZE } from '../enums/constants'
import { useStore } from 'vuex'

const konvaConfig = reactive({
  width: 600,
  height: 600,
})

const floorPlannerRef = ref(null)
const rectStartX = ref(0)
const rectStartY = ref(0)
const circleStartX = ref([])
const circleStartY = ref([])
const inputBoxRef = ref(null)
const stageRef = ref(null)

const tempDraggingCircle = reactive({
  visible: false,
  config: {
    ...baseCircleConfig,
    draggable: false,
  },
})

const store = useStore()

const lines = computed(() => {
  return store.getters['lines']
})

const circles = computed(() => {
  return store.getters['circles']
})

const selectedLine = computed(() => {
  return store.getters['selectedLine']
})

const groupFigure = computed(() => {
  return store.getters['groupFigure']
})

const lineSizesTextConfigs = computed(() => {
  return store.getters['lineSizesTextConfigs']
})

const selectedLineLength = computed({
  get() {
    return store.getters['selectedLineLength']
  },
  set(value) {
    store.dispatch('updateLineSize', {
      line: selectedLine.value,
      value,
    })
  },
})

const infoBlockConfig = computed(() => {
  const width = 300
  const height = 100
  const padding = 25
  const xPos = konvaConfig.width - width - padding
  const yPos = konvaConfig.height - height - padding
  return {
    width,
    height,
    stroke: '#555',
    strokeWidth: 5,
    x: xPos,
    y: yPos,
  }
})

const perimeterTextConfig = computed(() => {
  const padding = 10
  const perimeterInPixels = calcLinesLength(lines.value)
  const perimeter = pixelsToMeters(perimeterInPixels).toFixed(2)
  return {
    width: infoBlockConfig.value.width,
    text: `P = ${perimeter}`,
    x: infoBlockConfig.value.x + padding,
    y: infoBlockConfig.value.y + padding,
    fontSize: 20,
  }
})

const circleDragMoveHandler = (e, shape) => {
  const { target } = e
  const { x, y } = target.position()
  const { width, height } = target.size()
  const position = {
    x,
    y,
  }
  const closestXSnap = Math.round(x / GRID_CELL_SIZE) * GRID_CELL_SIZE
  const xDiff = Math.abs(closestXSnap - x)
  if (xDiff < width / 2) {
    position.x = closestXSnap
  }
  const closestYSnap = Math.round(y / GRID_CELL_SIZE) * GRID_CELL_SIZE
  const yDiff = Math.abs(closestYSnap - y)
  if (yDiff < height / 2) {
    position.y = closestYSnap
  }
  shape.x = position.x
  shape.y = position.y
  tempDraggingCircle.config.x = position.x
  tempDraggingCircle.config.y = position.y
  store.dispatch('updateLinesPosition')
}

const circleDragStart = (e) => {
  const { x, y } = e.target.position()
  e.target.fill('transparent')
  tempDraggingCircle.visible = true
  tempDraggingCircle.config.x = x
  tempDraggingCircle.config.y = y
}

const circleDragEnd = (e) => {
  e.target.fill('#fff')
  tempDraggingCircle.visible = false
  const { x, y } = tempDraggingCircle.config
  e.target.position({ x, y })
}

const rectDragMoveHandler = (e) => {
  const { x, y } = e.target.position()
  const diffX = x - rectStartX.value
  const diffY = y - rectStartY.value
  circles.value.forEach((c, index) => {
    const beforeStartX = circleStartX.value[index]
    const beforeStartY = circleStartY.value[index]
    c.x = beforeStartX + diffX
    c.y = beforeStartY + diffY
  })
  store.dispatch('updateLinesPosition')
}

const rectDragStartHandler = (e) => {
  const { x, y } = e.target.position()
  rectStartX.value = x
  rectStartY.value = y
  circleStartX.value = circles.value.map((c) => c.x)
  circleStartY.value = circles.value.map((c) => c.y)
}

const lineClick = async (e, lineId) => {
  e.cancelBubble = true
  store.commit('setSelectedLine', lineId)
  await nextTick()
  console.log(selectedLine.value)
  inputBoxRef.value.focus()
}

useResizeObserver(floorPlannerRef, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  konvaConfig.width = width
  konvaConfig.height = height
})

function stageClickHandler() {
  store.commit('setSelectedLine', null)
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
  <Teleport v-if="selectedLine" to="body">
    <FloorPlannerInputBox v-model="selectedLineLength" ref="inputBoxRef" />
  </Teleport>
  <div class="floor-planner" ref="floorPlannerRef">
    <v-stage ref="stageRef" :config="konvaConfig" @click="stageClickHandler">
      <v-layer>
        <CanvasGrid :width="konvaConfig.width" :height="konvaConfig.height" />
        <v-rect
          :config="groupFigure"
          @dragStart="rectDragStartHandler"
          @dragMove="rectDragMoveHandler"
        />
        <!-- <v-text v-for="textConfig in borderTextConfigs" :config="textConfig" /> -->
        <CanvasLine
          v-for="line in lines"
          :key="line.config.id"
          :config="line.config"
          :selected="line.config.id === selectedLine?.id"
          @click="lineClick"
        />
        <v-text
          v-for="sizeText in lineSizesTextConfigs"
          :key="sizeText.lineId"
          :config="sizeText"
          @click="lineClick($event, sizeText.lineId)"
        />
        <v-circle
          v-if="tempDraggingCircle.visible"
          :config="tempDraggingCircle.config"
        />
        <v-circle
          v-for="circle in circles"
          :key="circle.id"
          :config="circle"
          @dragStart="circleDragStart"
          @dragMove="circleDragMoveHandler($event, circle)"
          @dragEnd="circleDragEnd"
        >
        </v-circle>
        <v-rect :config="infoBlockConfig"></v-rect>
        <v-text :config="perimeterTextConfig" />
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
