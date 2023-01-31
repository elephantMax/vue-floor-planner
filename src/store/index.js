import { createStore } from 'vuex'
import { getFigureConfig } from '../helpers/getFigureConfig'
import { calcHypo, getLineData } from '../helpers/lineHelper'
import { pixelsToMeters } from '../helpers/pixelsToMeters'

const defaultStore = () => ({
  drawMode: false,
  selectedLineId: null,
  figure: null,
})

const store = createStore({
  state: defaultStore(),
  mutations: {
    setFigure(state, payload) {
      state.figure = payload
    },
    setDrawMode(state, payload) {
      state.drawMode = payload
      if (payload) {
        state.figure = null
        state.selectedLineId = null
      }
    },
    setSelectedLine(state, lineId) {
      state.selectedLineId = lineId
    },
  },
  actions: {
    setFigure({ commit }, type) {
      const config = getFigureConfig(type)
      commit('setFigure', config)
      commit('setDrawMode', false)
    },
    setCustomFigure({ commit }, config) {
      commit('setFigure', config)
      commit('setDrawMode', false)
    },
    updateLineSize({ dispatch }, { line, value }) {
      if (!value) {
        return
      }
      const { circles } = line
      const { xDiff, yDiff } = getLineData(line)
      const lineLength = calcHypo(line)
      const additionalPercent = value / lineLength
      const resX = xDiff * additionalPercent
      const resY = yDiff * additionalPercent
      const resXDiff = xDiff - resX
      const resYDiff = yDiff - resY
      const { end } = circles
      end.x += resXDiff
      end.y += resYDiff
      dispatch('updateLinesPosition')
    },
    updateLinesPosition({ state }) {
      const { lines = [] } = state.figure
      lines.forEach((line) => {
        const { config, circles } = line
        const { start, end } = circles
        config.points = [start.x, start.y, end.x, end.y]
      })
    },
    reset({ state }) {
      Object.assign(state, defaultStore())
    },
  },
  getters: {
    figure: (s) => s.figure,
    lines: (_, getters) => {
      return getters.figure?.lines || []
    },
    circles: (_, getters) => {
      return getters.figure?.circles || []
    },
    drawMode: (s) => s.drawMode,
    selectedLine: (state, getters) => {
      const { lines } = getters
      return lines.find((l) => l.config.id === state.selectedLineId)
    },
    selectedLineLength(_, getters) {
      const { selectedLine } = getters
      if (!selectedLine) {
        return 0
      }
      return calcHypo(selectedLine)
    },
    fullSize: (_, getters) => {
      const { circles } = getters
      if (!circles.length) {
        return { width: 0, height: 0 }
      }
      const xPositions = circles.map((c) => c.x)
      const xDifferences = xPositions
        .map((x) => xPositions.map((x2) => Math.abs(x - x2)))
        .flat()
      const width = +Math.max(...xDifferences).toFixed(2)
      const yPositions = circles.map((c) => c.y)
      const yDifferences = yPositions
        .map((y) => yPositions.map((y2) => Math.abs(y - y2)))
        .flat()
      const height = +Math.max(...yDifferences).toFixed(2)
      return { width, height }
    },
    position: (_, getters) => {
      const { circles } = getters
      if (!circles.length) {
        return { x: 0, y: 0 }
      }
      const xPositions = circles.map((c) => c.x)
      const yPositions = circles.map((c) => c.y)
      const x = Math.min(...xPositions)
      const y = Math.min(...yPositions)
      return { x, y }
    },
    groupFigure: (_, getters) => {
      const { fullSize, position } = getters
      const { width, height } = fullSize
      const { x, y } = position

      return {
        x: x - 10,
        y: y - 10,
        stroke: 'black',
        strokeWidth: 1,
        width: width + 20,
        height: height + 20,
        draggable: true,
      }
    },
    lineSizesTextConfigs: (_, getters) => {
      // const PADDING = 30
      const FONT_SIZE = 20
      const { lines } = getters
      return lines.map((line) => {
        const { config, circles } = line
        const { id } = config
        const { start, end } = circles
        const x = (start.x + end.x) / 2
        const y = (start.y + end.y) / 2
        const length = calcHypo(line)
        const lengthInMeters = pixelsToMeters(length).toFixed(2)
        const width = lengthInMeters.length * FONT_SIZE
        const padding = {
          x: 0,
          y: 0,
        }
        return {
          x: x + padding.x - width / 2,
          y: y + padding.y - FONT_SIZE / 2,
          text: lengthInMeters,
          width,
          fontSize: FONT_SIZE,
          align: 'center',
          fill: '#fff',
          lineId: id,
        }
      })
    },
  },
})

export { store }
