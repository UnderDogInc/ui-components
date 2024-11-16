import { Directive } from "vue"

const directive: Directive = {
  mounted: (el: HTMLElement, binding) => {
    binding.value(el)
    window.addEventListener('resize', binding.value)
  },
  unmounted: (el: HTMLElement, binding) => {
    window.removeEventListener('resize', binding.value)
  },
}

export default directive