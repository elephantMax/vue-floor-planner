import { FigureComponents } from './FigureComponents'
import { FigureType } from './FigureTypes'
import { LFigureConfiguration } from './LFigureConfiguration'

import { RectConfiguration } from './RectConfiguration'
import { TFigureConfiguration } from './TFigureConfiguration'

const configurationGetter = {
  [FigureType.RECT]: RectConfiguration,
  [FigureType.T_FIGURE]: TFigureConfiguration,
  [FigureType.L_FIGURE]: LFigureConfiguration,
}

export class Figure {
  constructor(type) {
    this.id = Date.now().toString()
    this.config = this.getConfig(type)
    this.component = FigureComponents[type]
    this.type = type
  }

  getConfig(type) {
    const commonConfig = {
      id: this.id,
      strokeWidth: 1,
      draggable: true,
      stroke: 'black',
    }
    const figureConfig = new configurationGetter[type](this.id)
    return Object.assign(commonConfig, figureConfig)
  }
}
