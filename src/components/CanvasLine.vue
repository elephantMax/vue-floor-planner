<script setup>
import { computed } from 'vue'
import { SELECTED_LINE_STROKE } from '../enums/constants'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const lineConfig = computed(() => {
  const config = {
    ...props.config,
  }
  if (props.selected) {
    config.stroke = SELECTED_LINE_STROKE
  }
  return config
})

const clickHandler = (e) => {
  emit('click', e, props.config.id)
}
</script>

<template>
  <v-line :config="lineConfig" @click="clickHandler" />
</template>
