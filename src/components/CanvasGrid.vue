<script setup>
import { computed } from 'vue'

const CELL_SIZE = 100

const props = defineProps({
  width: Number,
  height: Number,
})

const lines = computed(() => {
  const array = []
  const rows = Math.ceil(props.width / CELL_SIZE)
  const columns = Math.ceil(props.height / CELL_SIZE)
  for (let row = 0; row < rows; row++) {
    const x = row * CELL_SIZE
    const newLine = createLine({ x, points: [0, 0, 0, props.height] })
    array.push(newLine)
  }
  for (let column = 0; column < columns; column++) {
    const y = column * CELL_SIZE
    const newLine = createLine({ y, points: [0, 0, props.width, 0] })
    array.push(newLine)
  }
  return array
})

const createLine = ({ x = 0, y = 0, points = [] }) => {
  return {
    x,
    y,
    stroke: 'rgba(0, 0, 0, 0.2)',
    strokeWidth: 1,
    points,
  }
}
</script>

<template>
  <v-line v-for="line in lines" :config="line" />
</template>
