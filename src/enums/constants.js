const GRID_CELL_SIZE = 100
const SELECTED_LINE_STROKE = '#faea00'
const CIRCLE_COLOR = '#fff'
const LINE_STROKE = '#000'
const TEXT_FONT_SIZE = 20

const baseCircleConfig = {
  fill: CIRCLE_COLOR,
  radius: 10,
  draggable: true,
}

const baseLineConfig = {
  stroke: LINE_STROKE,
  strokeWidth: 12,
}

export {
  LINE_STROKE,
  GRID_CELL_SIZE,
  SELECTED_LINE_STROKE,
  TEXT_FONT_SIZE,
  baseLineConfig,
  baseCircleConfig,
}
