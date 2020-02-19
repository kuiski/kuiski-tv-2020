import { reactive } from '@vue/composition-api'

const px = (n: number) => {
  return n
  // return `${n}px`
}

export default function() {
  const size = reactive({
    width: px(window.innerWidth),
    height: px(window.innerHeight)
  })
  window.addEventListener('resize', () => {
    size.height = px(window.innerHeight)
    size.width = px(window.innerWidth)
  })

  return size
}
