<script setup>
import { reactive, ref, computed } from 'vue'
import { useRect } from '../helpers/useRect'
import { useResizeObserver } from '@vueuse/core'

const konvaConfig = reactive({
  width: 600,
  height: 600,
})

const floorPlannerRef = ref(null)
const rectStartX = ref(0)
const rectStartY = ref(0)
const circleStartX = ref([])
const circleStartY = ref([])

const {
  circles,
  lines,
  fullSize,
  position,
  selectedLine,
  selectedLineId,
  selectedLineLength,
  borderTextConfigs,
  updateLineSize,
  lineSizesTextConfigs,
} = useRect()

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

const circleDragMoveHandler = (e, shape) => {
  const { target } = e
  const { x, y } = target.position()
  shape.x = x
  shape.y = y
}

const rectDragMoveHandler = (e) => {
  const { x, y } = e.target.position()
  const diffX = x - rectStartX.value
  const diffY = y - rectStartY.value
  circles.forEach((c, index) => {
    const beforeStartX = circleStartX.value[index]
    const beforeStartY = circleStartY.value[index]
    c.x = beforeStartX + diffX
    c.y = beforeStartY + diffY
  })
}

const rectDragStartHandler = (e) => {
  const { x, y } = e.target.position()
  rectStartX.value = x
  rectStartY.value = y
  circleStartX.value = circles.map((c) => c.x)
  circleStartY.value = circles.map((c) => c.y)
}

const lineClick = (e, lineId) => {
  e.cancelBubble = true
  selectedLineId.value = lineId
}

const lineLengthChangeHandler = (e) => {
  updateLineSize(selectedLine.value, e.target.valueAsNumber)
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
</script>

<template>
  <template v-if="selectedLineId">
    <input
      type="number"
      :value="selectedLineLength"
      @change="lineLengthChangeHandler"
    />
  </template>
  <div class="floor-planner" ref="floorPlannerRef">
    <v-stage ref="stage" :config="konvaConfig" @click="stageClickHandler">
      <v-layer>
        <v-rect
          :config="groupConfig"
          @dragStart="rectDragStartHandler"
          @dragMove="rectDragMoveHandler"
        />
        <!-- <v-text v-for="textConfig in borderTextConfigs" :config="textConfig" /> -->
        <v-line
          v-for="line in lines"
          :config="line"
          @click="lineClick($event, line.id)"
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
