import { reactive, computed } from '@vue/composition-api'

const px = (n: number) => {
  return `${n}px`
}

export function useScreenSize() {
  const size = reactive({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const resizeListener = () => {
    size.height = window.innerHeight
    size.width = window.innerWidth
  }

  window.addEventListener('resize', resizeListener)

  const stopListener = () =>
    window.removeEventListener('resize', resizeListener)

  return {
    size,
    stopListener
  }
}

export function useScreenSizeStr() {
  const { size, stopListener } = useScreenSize()
  return {
    size: computed(() =>
      reactive({
        width: px(size.width),
        height: px(size.height)
      })
    ),
    stopListener
  }
}
