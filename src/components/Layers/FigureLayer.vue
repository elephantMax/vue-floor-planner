<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import { useStore } from 'vuex'
import { baseCircleConfig, GRID_CELL_SIZE } from '../../enums/constants'
import CalculatedInfo from '../CalculatedInfo.vue'
import CanvasLine from '../CanvasLine.vue'
import FloorPlannerInputBox from '../FloorPlannerInputBox.vue'

defineProps({
  width: Number,
  height: Number,
})

const store = useStore()

const rectStartX = ref(0)
const rectStartY = ref(0)
const circleStartX = ref([])
const circleStartY = ref([])
const inputBoxRef = ref(null)

const lines = computed(() => {
  return store.getters['lines']
})

const circles = computed(() => {
  return store.getters['circles']
})

const selectedLineId = computed(() => {
  return store.getters['selectedLineId']
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

const tempDraggingCircle = reactive({
  visible: false,
  config: {
    ...baseCircleConfig,
    draggable: false,
  },
})

const lineClick = (e, line) => {
  e.cancelBubble = true
  const { id } = line.config
  toggleDirection(line)
  store.commit('setSelectedLine', id)
  focusInput()
}

const selectLine = (e, lineId) => {
  e.cancelBubble = true
  if (selectedLine.value) {
    toggleDirection(selectedLine.value)
  }
  store.commit('setSelectedLine', lineId)
  focusInput()
}

const toggleDirection = (line) => {
  const { id } = line.config
  const isSelected = selectedLineId.value === id
  if (isSelected) {
    store.dispatch('switchLineDirection', line)
  }
}

const focusInput = async () => {
  await nextTick()
  inputBoxRef.value?.focus()
}

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
</script>

<template>
  <Teleport v-if="selectedLine" to="body">
    <FloorPlannerInputBox v-model="selectedLineLength" ref="inputBoxRef" />
  </Teleport>
  <v-rect
    :config="groupFigure"
    @dragStart="rectDragStartHandler"
    @dragMove="rectDragMoveHandler"
  />
  <CanvasLine
    v-for="line in lines"
    :key="line.config.id"
    :line="line"
    :selected="line.config.id === selectedLineId"
    @click="lineClick"
  />
  <v-text
    v-for="sizeText in lineSizesTextConfigs"
    :key="sizeText.lineId"
    :config="sizeText"
    @click="selectLine($event, sizeText.lineId)"
    @tap="selectLine($event, sizeText.lineId)"
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
  <CalculatedInfo :width="width" :height="height" />
</template>
