<script setup>
import { computed, ref } from '@vue/reactivity'
import { pixelsToMeters } from '../helpers/pixelsToMeters'
import { metersToPixels } from '../helpers/metersToPixels'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
})

const inputRef = ref(null)

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return pixelsToMeters(props.modelValue)
  },
  set(value) {
    const pixels = metersToPixels(value)
    emit('update:modelValue', pixels)
  },
})

function focus() {
  inputRef?.value.focus()
  inputRef?.value.select()
}

defineExpose({ focus })
</script>
<template>
  <div class="floor-planner-input-box">
    <input v-model.lazy="value" ref="inputRef" :min="0.01" type="number" />
  </div>
</template>

<style lang="scss" scoped>
.floor-planner-input-box {
  position: absolute;
  top: 10px;
  left: 0px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
