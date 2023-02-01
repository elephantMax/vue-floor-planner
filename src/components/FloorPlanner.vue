<script setup>
import { reactive, ref, computed } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import CanvasGrid from './CanvasGrid.vue'
import { useStore } from 'vuex'
import FigureLayer from './FigureLayer.vue'

const konvaConfig = reactive({
  width: 600,
  height: 600,
})

const floorPlannerRef = ref(null)

const stageRef = ref(null)

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

function stageClickHandler(e) {
  store.commit('setSelectedLine', null)
  if (drawMode.value) {
    const pos = getMousePosition(e)
    store.dispatch('pushPoint', pos)
  }
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
    <v-stage ref="stageRef" :config="konvaConfig" @click="stageClickHandler">
      <v-layer>
        <CanvasGrid :width="konvaConfig.width" :height="konvaConfig.height" />
        <FigureLayer
          v-if="!drawMode"
          :width="konvaConfig.width"
          :height="konvaConfig.height"
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
