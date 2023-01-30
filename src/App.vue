<script setup>
import { provide, ref } from 'vue'
import FloorPlanner from './components/FloorPlanner.vue'
import FloorPlannerPanel from './components/FloorPlannerPanel.vue'

const planner = ref(null)

const selectFigure = (type) => {
  planner.value.selectFigure(type)
}

provide('selectFigure', selectFigure)
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
