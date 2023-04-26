<script setup>
import { reactive, inject } from 'vue'

const props = defineProps({
  width: Number,
  height: Number,
  points: {
    type: Array,
    required: true,
  },
  mouseActive: {
    type: Boolean,
    default: false,
  },
})

const markedPoints = inject('markedPoints')
const pushPoint = inject('pushPoint')

const line = reactive({
  points: [],
  stroke: '#000',
})

function mouseEnterHandler(e, point) {
  if (!props.mouseActive) {
    return
  }
  pushPoint(e.target, point)
  joinPoints()
}

function mouseDownHandler(e, point) {
  pushPoint(e.target, point)
}

function joinPoints() {
  line.points = markedPoints.value.reduce((acc, point) => {
    return [...acc, point.x, point.y]
  }, [])
}

defineExpose({ joinPoints })
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
