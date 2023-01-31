<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import { useFigure } from '../helpers/useFigure'
import { calcLinesLength } from '../helpers/lineHelper'
import { useResizeObserver } from '@vueuse/core'
import FloorPlannerInputBox from './FloorPlannerInputBox.vue'
import CanvasLine from './CanvasLine.vue'
import { pixelsToMeters } from '../helpers/pixelsToMeters'
import CanvasGrid from './CanvasGrid.vue'
import { baseCircleConfig } from '../helpers/useFigureConfig'

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

const tempDraggingCircle = reactive({
  visible: false,
  config: {
    ...baseCircleConfig,
    draggable: false,
  },
})

const {
  circles,
  lines,
  selectedLine,
  selectedLineId,
  selectedLineLength,
  lineSizesTextConfigs,
  groupConfig,
  updateLinesPosition,
  setFigure,
  clear,
} = useFigure()

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
  const closestXSnap = Math.round(x / 100) * 100
  const xDiff = Math.abs(closestXSnap - x)
  if (xDiff < width / 2) {
    position.x = closestXSnap
  }
  const closestYSnap = Math.round(y / 100) * 100
  const yDiff = Math.abs(closestYSnap - y)
  if (yDiff < height / 2) {
    position.y = closestYSnap
  }
  shape.x = position.x
  shape.y = position.y
  tempDraggingCircle.config.x = position.x
  tempDraggingCircle.config.y = position.y
  updateLinesPosition()
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
  updateLinesPosition()
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
  selectedLineId.value = lineId
  await nextTick()
  inputBoxRef.value.focus()
}

useResizeObserver(floorPlannerRef, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  konvaConfig.width = width
  konvaConfig.height = height
})

function stageClickHandler() {
  selectedLineId.value = null
}

defineExpose({ clear, setFigure })
</script>

<template>
  <Teleport v-if="selectedLine" to="body">
    <FloorPlannerInputBox v-model="selectedLineLength" ref="inputBoxRef" />
  </Teleport>
  <div
    v-if="circles.length && lines.length"
    class="floor-planner"
    ref="floorPlannerRef"
  >
    <v-stage ref="stage" :config="konvaConfig" @click="stageClickHandler">
      <v-layer>
        <CanvasGrid :width="konvaConfig.width" :height="konvaConfig.height" />
        <v-rect
          :config="groupConfig"
          @dragStart="rectDragStartHandler"
          @dragMove="rectDragMoveHandler"
        />
        <!-- <v-text v-for="textConfig in borderTextConfigs" :config="textConfig" /> -->
        <CanvasLine
          v-for="line in lines"
          :config="line.config"
          :selected="line.config.id === selectedLineId"
          @click="lineClick"
        />
        <v-text
          v-for="sizeText in lineSizesTextConfigs"
          :config="sizeText"
          @click="lineClick($event, sizeText.lineId)"
        />
        <v-circle
          v-if="tempDraggingCircle.visible"
          :config="tempDraggingCircle.config"
        />
        <v-circle
          v-for="circle in circles"
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
