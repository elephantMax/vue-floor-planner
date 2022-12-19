<script setup>
import { reactive, ref, computed } from 'vue'
import { useRect } from './helpers/useRect'

const konvaConfig = reactive({
  width: 600,
  height: 600,
})

const rectStartX = ref(0)
const rectStartY = ref(0)
const circleStartX = ref([])
const circleStartY = ref([])

const {
  circles,
  lines,
  fullSize,
  position,
  selectedLine,
  selectedLineId,
  selectedLineLength,
  updateLineSize,
} = useRect()

const groupConfig = computed(() => {
  const { width, height } = fullSize.value
  const { x, y } = position.value
  return {
    x: x - 10,
    y: y - 10,
    stroke: 'black',
    strokeWidth: 1,
    width: width + 20,
    height: height + 20,
    draggable: true,
  }
})

const dragMoveHandler = (e, shape) => {
  const { target } = e
  const { x, y } = target.position()
  shape.x = x
  shape.y = y
}

const dragMoveRectHandler = (e) => {
  const { x, y } = e.target.position()
  const diffX = x - rectStartX.value
  const diffY = y - rectStartY.value
  circles.forEach((c, index) => {
    const beforeStartX = circleStartX.value[index]
    const beforeStartY = circleStartY.value[index]
    c.x = beforeStartX + diffX
    c.y = beforeStartY + diffY
  })
}

const dragStartHandler = (e) => {
  const { x, y } = e.target.position()
  rectStartX.value = x
  rectStartY.value = y
  circleStartX.value = circles.map((c) => c.x)
  circleStartY.value = circles.map((c) => c.y)
}

const lineClick = (line) => {
  selectedLineId.value = line.id
}

const lineLengthChangeHandler = (e) => {
  updateLineSize(selectedLine.value, e.target.valueAsNumber)
}
</script>

<template>
  <template v-if="selectedLineId">
    <input
      type="number"
      :value="selectedLineLength"
      @change="lineLengthChangeHandler"
    />
  </template>
  <v-stage ref="stage" :config="konvaConfig">
    <v-layer>
      <v-rect
        :config="groupConfig"
        @dragStart="dragStartHandler"
        @dragMove="dragMoveRectHandler"
      />
      <v-line v-for="line in lines" :config="line" @click="lineClick(line)" />
      <v-circle
        v-for="circle in circles"
        :config="circle"
        @dragMove="dragMoveHandler($event, circle)"
      >
      </v-circle>
    </v-layer>
  </v-stage>
</template>
