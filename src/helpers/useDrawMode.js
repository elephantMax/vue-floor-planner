import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { baseCircleConfig, GRID_CELL_SIZE } from '../enums/constants'
import uniqid from 'uniqid'
import { optimizePath } from './optimizePath'

const useDrawMode = (konvaConfig) => {
  const store = useStore()

  const markedPoints = reactive([])
  const createLayoutPoints = ref([])
  const createLayerRef = ref(null)

  const drawMode = computed(() => {
    return store.getters['drawMode']
  })

  const mouseMoveEvent = reactive({
    active: false,
  })

  watch(drawMode, (value) => {
    if (value) {
      createLayoutPoints.value = generatePoints()
      return
    }
    resetDrawMode()
  })

  function resetDrawMode() {
    markedPoints.length = 0
    createLayoutPoints.value = []
    mouseMoveEvent.active = false
  }

  function pushMarkedPoint(target, point) {
    if (!point.marked) {
      if (markedPoints.length >= 20) {
        return createCustomFigure()
      }
      markedPoints.push(point)
      target.fill('#000')
      point.marked = true
      createLayerRef.value.joinPoints()
    }
  }

  const generatePoints = () => {
    const array = []
    const rows = Math.ceil(konvaConfig.width / GRID_CELL_SIZE)
    const columns = Math.ceil(konvaConfig.height / GRID_CELL_SIZE)
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const point = createPoint({
          x: row * GRID_CELL_SIZE,
          y: column * GRID_CELL_SIZE,
        })
        array.push(point)
      }
    }
    return array
  }

  const createPoint = ({ x = 0, y = 0 }) => {
    return {
      ...baseCircleConfig,
      draggable: false,
      id: uniqid(),
      x,
      y,
      marked: false,
    }
  }

  const createCustomFigure = () => {
    if (markedPoints.length < 3) {
      return
    }
    const optimizedPoints = optimizePath(markedPoints)
    const arrayOfPoints = optimizedPoints.reduce((acc, { x, y }) => {
      return [...acc, x, y]
    }, [])
    store.dispatch('setCustomFigure', arrayOfPoints)
    resetDrawMode()
  }

  function getPressedPoint(x, y, radiusX, radiusY) {
    return createLayoutPoints.value.find(
      (point) =>
        Math.abs(x - point.x) < radiusX && Math.abs(y - point.y) < radiusY
    )
  }

  return {
    markedPoints,
    createLayerRef,
    createLayoutPoints,
    mouseMoveEvent,
    drawMode,
    resetDrawMode,
    getPressedPoint,
    pushMarkedPoint,
    createCustomFigure,
  }
}

export { useDrawMode }
