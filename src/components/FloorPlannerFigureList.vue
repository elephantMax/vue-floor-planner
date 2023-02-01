<script setup>
import { useStore } from 'vuex'
import { FigureType } from '../enums/FigureTypes'
import { computed } from 'vue'

const store = useStore()

const Icon = {
  [FigureType.RECT]: '[]',
  [FigureType.L_FIGURE]: 'Г',
  [FigureType.T_FIGURE]: 'Т',
  [FigureType.CUSTOM]: 'Р',
}

const items = computed(() => {
  return Object.values(FigureType)
    .map((type) => ({
      icon: Icon[type],
      visible: !drawMode.value,
      onClick: () => {
        store.dispatch('setFigure', type)
        if (type === FigureType.CUSTOM) {
          store.commit('setDrawMode', true)
        }
      },
    }))
    .filter(({ visible }) => visible)
})

const drawMode = computed(() => {
  return store.getters['drawMode']
})

const cancel = () => {
  store.dispatch('setFigure', null)
}
</script>

<template>
  <div class="figure-list">
    <div
      v-for="item in items"
      :key="item.type"
      class="figure-item"
      @click="item.onClick"
    >
      {{ item.icon }}
    </div>
    <template v-if="drawMode">
      <div class="figure-item" @click="cancel">Отмена</div>
    </template>
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

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
