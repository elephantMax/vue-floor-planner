import { computed } from 'vue'

const baseTextConfig = {
  align: 'center',
  fill: '#000',
}

const useBorderConfig = (fullSize, position) => {
  const topTextConfig = computed(() => {
    const { x, y } = position.value
    const { width } = fullSize.value

    return {
      x,
      y: y - 30,
      text: width,
      width,
      ...baseTextConfig,
    }
  })

  const bottomTextConfig = computed(() => {
    const { x, y } = position.value
    const { height, width } = fullSize.value

    return {
      x,
      y: height + y + 20,
      text: width,
      width,
      ...baseTextConfig,
    }
  })

  const leftTextConfig = computed(() => {
    const { x, y } = position.value
    const { height } = fullSize.value

    return {
      x: x - 40,
      y: y + height / 2 - 10,
      text: height,
      ...baseTextConfig,
    }
  })

  const rightTextConfig = computed(() => {
    const { x, y } = position.value
    const { height, width } = fullSize.value

    return {
      x: x + width + 20,
      y: y + height / 2 - 10,
      text: height,
      ...baseTextConfig,
    }
  })

  const borderConfig = computed(() => {
    return [
      topTextConfig.value,
      bottomTextConfig.value,
      leftTextConfig.value,
      rightTextConfig.value,
    ]
  })

  return { borderConfig }
}

export { useBorderConfig }
