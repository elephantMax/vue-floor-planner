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
    <FloorPlannerPanel class="panel" />
    <FloorPlanner ref="planner" />
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.panel {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
