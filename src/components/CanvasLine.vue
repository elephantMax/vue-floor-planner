<script setup>
import { computed } from 'vue'
import { SELECTED_LINE_STROKE } from '../enums/constants'

const props = defineProps({
  line: {
    type: Object,
    default: () => ({}),
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const commonConfig = computed(() => {
  const config = { ...props.line.config }
  if (props.selected) {
    config.stroke = SELECTED_LINE_STROKE
  }
  return config
})

const lineConfig = computed(() => {
  return {
    ...commonConfig.value,
    visible: !props.selected,
  }
})

const arrowConfig = computed(() => {
  return {
    ...commonConfig.value,
    visible: props.selected,
  }
})

const clickHandler = (e) => {
  emit('click', e, props.line)
}
</script>

<template>
  <v-arrow :config="arrowConfig" @click="clickHandler" @tap="clickHandler" />
  <v-line :config="lineConfig" @click="clickHandler" @tap="clickHandler" />
</template>
