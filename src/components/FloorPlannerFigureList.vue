<script setup>
import { inject } from 'vue'
import { FigureType } from '../enums/FigureTypes'

const setFigure = inject('setFigure')

const Icon = {
  [FigureType.RECT]: '[]',
  [FigureType.L_FIGURE]: 'Г',
  [FigureType.T_FIGURE]: 'Т',
}

const figures = Object.values(FigureType).map((type) => ({
  type,
  icon: Icon[type],
}))

const createFigureHandler = (type) => {
  setFigure(type)
}
</script>

<template>
  <div class="figure-list">
    <div
      v-for="figure in figures"
      :key="figure.type"
      class="figure-item"
      @click="createFigureHandler(figure.type)"
    >
      {{ figure.icon }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.figure-list {
  display: flex;
  flex-direction: column;
}

.figure-item {
  font-weight: bold;
  padding: 10px;
  border: 1px black solid;
  cursor: pointer;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
