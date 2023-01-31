<script setup>
import { onMounted, provide, ref } from 'vue'
import FloorPlanner from './components/FloorPlanner.vue'
import FloorPlannerPanel from './components/FloorPlannerPanel.vue'

const planner = ref(null)

const setFigure = (type) => {
  planner.value.setFigure(type)
}

onMounted(() => {
  setFigure()
})

provide('setFigure', setFigure)
</script>

<template>
  <div class="wrapper">
    <FloorPlannerPanel />
    <FloorPlanner ref="planner" />
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
