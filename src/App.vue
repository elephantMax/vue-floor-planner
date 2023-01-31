<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import FloorPlanner from './components/FloorPlanner.vue'
import FloorPlannerPanel from './components/FloorPlannerPanel.vue'
import { FigureType } from './enums/FigureTypes'

const store = useStore()

onMounted(() => {
  store.dispatch('setFigure', FigureType.RECT)
})
</script>

<template>
  <div class="wrapper">
    <FloorPlannerPanel />
    <FloorPlanner />
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
