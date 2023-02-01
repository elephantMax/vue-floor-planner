<script setup>
import { computed, reactive } from 'vue'
import { baseCircleConfig, GRID_CELL_SIZE } from '../../enums/constants'
import uniqid from 'uniqid'

const props = defineProps({
  width: Number,
  height: Number,
  mouseActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['limit'])

const markedPoints = reactive([])
const line = reactive({
  points: [],
  stroke: '#000',
})

const points = computed(() => {
  const points = []
  const rows = Math.ceil(props.width / GRID_CELL_SIZE)
  const columns = Math.ceil(props.height / GRID_CELL_SIZE)
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const point = createPoint({
        x: row * GRID_CELL_SIZE,
        y: column * GRID_CELL_SIZE,
      })
      points.push(point)
    }
  }
  return points
})

const createPoint = ({ x = 0, y = 0 }) => {
  return {
    ...baseCircleConfig,
    draggable: false,
    id: uniqid(),
    x,
    y,
    marked: false,
  }
}

function mouseEnterHandler(e, point) {
  if (!props.mouseActive) {
    return
  }
  pushPoint(e.target, point)
}

function mouseDownHandler(e, point) {
  pushPoint(e.target, point)
}

function pushPoint(target, point) {
  if (!point.marked) {
    if (markedPoints.length >= 20) {
      return emit('limit', markedPoints)
    }
    markedPoints.push(point)
    target.fill('#000')
    point.marked = true
    joinPoints()
  }
}

function joinPoints() {
  line.points = markedPoints.reduce((acc, point) => {
    return [...acc, point.x, point.y]
  }, [])
}

function getMarkedPoints() {
  return markedPoints
}

defineExpose({ getMarkedPoints })
</script>

<template>
  <v-circle
    v-for="point in points"
    :key="point.id"
    :config="point"
    @mouseenter="mouseEnterHandler($event, point)"
    @mousedown="mouseDownHandler($event, point)"
  />
  <v-line :config="line" />
</template>
