<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { calcLinesLength } from '../helpers/lineHelper'
import { pixelsToMeters } from '../helpers/pixelsToMeters'

const props = defineProps({
  width: Number,
  height: Number,
})

const store = useStore()

const lines = computed(() => {
  return store.getters['lines']
})

const infoBlockConfig = computed(() => {
  const width = 200
  const height = 50
  const padding = 25
  const xPos = props.width - width - padding
  const yPos = props.height - height - padding
  return {
    width,
    height,
    fill: '#fff',
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
</script>

<template>
  <v-rect :config="infoBlockConfig"></v-rect>
  <v-text :config="perimeterTextConfig" />
</template>
