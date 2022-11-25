<script setup>
import { provide, ref } from 'vue'
import FloorPlanner from './components/FloorPlanner/FloorPlanner.vue'
import FloorPlannerPanel from './components/FloorPlanner/FloorPlannerPanel.vue'

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
  margin-top: 100px;
  margin-left: 100px;
  position: relative;
}

.panel {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
