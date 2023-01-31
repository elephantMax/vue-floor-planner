<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import { useFigure } from '../helpers/useFigure'
import { useResizeObserver } from '@vueuse/core'
import FloorPlannerInputBox from './FloorPlannerInputBox.vue'
import CanvasLine from './CanvasLine.vue'

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

const circleDragMoveHandler = (e, shape) => {
  const { target } = e
  const { x, y } = target.position()
  shape.x = x
  shape.y = y
  updateLinesPosition()
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
          v-for="circle in circles"
          :config="circle"
          @dragMove="circleDragMoveHandler($event, circle)"
        >
        </v-circle>
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
