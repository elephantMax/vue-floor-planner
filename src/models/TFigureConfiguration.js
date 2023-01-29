export class TFigureConfiguration {
  constructor() {
    const topLine = [0, 0, 300, 0]
    const rightTopLine = [300, 100, 200, 100]

    this.points = [
      ...topLine,
      ...rightTopLine,
      200,
      300,
      100,
      300,
      100,
      100,
      0,
      100,
    ]
    this.closed = true
  }
}
