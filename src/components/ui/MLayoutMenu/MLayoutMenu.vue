<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { activeZIndex, convertToUnit } from '../../../assets/utils/utils'


const props = defineProps({
  attach: {
    type: [Boolean, String, Element],
    default: false,
  },
  closeOnClick: {
    type: Boolean,
    default: true,
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: [Number, String],
    default: 'auto',
  },
  minHeight: {
    type: [Number, String],
  },
  maxWidth: {
    type: [Number, String],
    default: 'auto',
  },
  minWidth: [Number, String],
  nudgeWidth: {
    type: [Number, String],
    default: 0,
  },
  nudgeLeft: {
    type: [String, Number],
    default: '0',
  },
  nudgeRight: {
    type: [String, Number],
    default: '0',
  },
  nudgeTop: {
    type: [String, Number],
    default: '0',
  },
  nudgeBottom: {
    type: [String, Number],
    default: '0',
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  origin: {
    type: String,
    default: 'top left',
  },
  zIndex: {
    type: Number,
    default: undefined,
  },
  positionX: {
    type: Number,
    default: null,
  },
  positionY: {
    type: Number,
    default: null,
  },
  classBody: {
    type: String,
    default: null,
  },
  transitionName: {
    type: String,
    default: '',
  },
  offsetOverflow: Boolean,
  allowOverflow: Boolean,
  auto: Boolean,
  absolute: Boolean,
  left: Boolean,
  top: Boolean,
  right: Boolean,
  bottom: Boolean,
  offsetX: Boolean,
  offsetY: Boolean,
  disabled: Boolean,
})
const emits = defineEmits(['update:isOpen', 'clickOutside', 'openMenu', 'closeMenu'])

const activator = ref<HTMLElement|null>(null)
const content = ref<HTMLElement|null>(null)

const isOpen = ref(props.isOpen)

const activatorFixed = ref(false)

const calculatedTopAuto = ref(0)
const pageYOffset = ref(0)
const relativeYOffset = ref(0)
const pageWidth = ref(0)
const defaultOffset = ref<number>(8)
const absoluteY = ref(0)
const absoluteX = ref(0)

const dimensions = ref({
  activator: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    offsetTop: 0,
    scrollHeight: 0,
    offsetLeft: 0,
  },
  content: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    offsetTop: 0,
    scrollHeight: 0,
  },
})

const checkActivatorFixed = () => {
  if (props.attach !== false) return

  let el = activator.value
  
  while (el) {
    if (window.getComputedStyle(el).position === 'fixed') {
      activatorFixed.value = true

      return
    }

    el = el.offsetParent as HTMLElement
  }

  activatorFixed.value = false
}

const absoluteYOffset =  computed((): number => pageYOffset.value - relativeYOffset.value)
const getOffsetLeft = () => window.pageXOffset || document.documentElement.scrollLeft
const getOffsetTop = () => window.pageYOffset || document.documentElement.scrollTop
const getInnerHeight = () => window.innerHeight || document.documentElement.clientHeight

const checkForPageYOffset = () => {
  pageYOffset.value = activatorFixed.value 
    ? 0
    : getOffsetTop()
}

const computedLeft = computed(() => {
  const a = dimensions.value.activator
  const c = dimensions.value.content

  const activatorLeft = (props.attach !== false
    ? a.offsetLeft
    : a.left) || 0
  const minWidth = Math.max(a.width, c.width)
  let left = 0
  left += activatorLeft

  if ( props.left ) {
    left -= (minWidth - a.width)
  }

  if (props.offsetX) {
    const maxWidth = isNaN(Number(props.maxWidth))
      ? a.width
      : Math.min(a.width, Number(props.maxWidth))
    left += props.left
      ? -maxWidth
      : a.width
  }

  if (props.nudgeLeft) {
    left -= parseInt(String(props.nudgeLeft))
  }

  if (props.nudgeRight) {
    left += parseInt(String(props.nudgeRight))
  }

  return left
})

const computedTop = computed(() => {
  const a = dimensions.value.activator
  const c = dimensions.value.content
  let top = 0

  if (props.top) {
    top += a.height - c.height
  }

  if (props.attach !== false) {
    top += a.offsetTop
  }
  else {
    top += a.top + pageYOffset.value
  } 

  if (props.offsetY) {
    top += props.top
      ? -a.height 
      : a.height
  } 

  if (props.nudgeTop) {
    top -= parseInt(String(props.nudgeTop))
  }

  if (props.nudgeBottom) {
    top += parseInt(String(props.nudgeBottom))
  }

  return top
})

const calculatedTop = computed((): string => {
  const top = !props.auto
    ? calcTop()
    : convertToUnit(calcYOverflow(calculatedTopAuto.value))
  
  if (props.positionY) {
    if (
      pageYOffset.value + getInnerHeight() - props.positionY - dimensions.value.content.height - 12 < 0
    ) {
      return convertToUnit(pageYOffset.value + getInnerHeight() - dimensions.value.content.height - 12) || ''
    }

    return convertToUnit(props.positionY) || ''
  }

  return top || '0'
})

const calcTop = () => {
  return convertToUnit(props.attach !== false
    ? computedTop.value
    : calcYOverflow(computedTop.value))
}

const calcYOverflow = (top: number) => {
  const documentHeight = getInnerHeight()
  const toTop = absoluteYOffset.value + documentHeight
  const activator = dimensions.value.activator
  const contentHeight = dimensions.value.content.height
  const totalHeight = top + contentHeight
  const isOverflowing = toTop < totalHeight

  if (isOverflowing &&
    props.offsetOverflow &&
    activator.top > contentHeight
  ) {
    top = pageYOffset.value + (activator.top - contentHeight)
  }
  else if (isOverflowing && !props.allowOverflow) {
    top = toTop - contentHeight - 12
  }
  else if (top < absoluteYOffset.value && !props.allowOverflow) {
    top = absoluteYOffset.value + 12
  }

  return top < 12
    ? 12
    : top
}

const calculatedMaxHeight = computed((): string => {
  const height = props.auto
    ? '200px'
    : convertToUnit(props.maxHeight)

  return height || '0'
})

const calculatedMaxWidth = computed((): string => convertToUnit(props.maxWidth) || '0')

const calculatedMinWidth = computed(() => {
  if (props.minWidth) {
    return convertToUnit(props.minWidth) || '0'
  }

  const minWidth = Math.min(
    dimensions.value.activator.width +
    Number(props.nudgeWidth) +
    (props.auto 
      ? 16
      : 0),
    Math.max(pageWidth.value - 24, 0)
  )

  const VarsCalculatedMaxWidth = isNaN(parseInt(calculatedMaxWidth.value))
    ? minWidth
    : parseInt(calculatedMaxWidth.value)

  return convertToUnit(Math.min(
    VarsCalculatedMaxWidth,
    minWidth
  )) || '0'
})

const calculatedLeft =  computed((): string => {
  const menuWidth = Math.max(dimensions.value.content.width, parseFloat(calculatedMinWidth.value))

  if (props.positionX) {
    if (
      getOffsetLeft() + pageWidth.value - props.positionX - dimensions.value.content.width - 12 < 0
    ) {
      return convertToUnit(getOffsetLeft() + pageWidth.value - dimensions.value.content.width - 12) || ''
    }

    return convertToUnit(props.positionX) || ''
  }

  if (!props.auto) return calcLeft(menuWidth) || '0'

  return convertToUnit(calcXOverflow(calcLeftAuto(), menuWidth)) || '0'
})

const calcXOverflow = (left: number, menuWidth: number) => {
  const xOverflow = left + menuWidth - pageWidth.value + 12

  if ((!props.left || props.right) && xOverflow > 0) {
    left = Math.max(left - xOverflow, 0)
  } 
  else {
    left = Math.max(left, 12)
  }

  return left + getOffsetLeft()
}

const teleportTarget = computed(() => {

  const _target = props.attach
  
  if (_target === true) return undefined
  
  const targetElement =
  _target === false
    ? document.body
    : typeof _target === 'string'
      ? document.querySelector(_target)
      : _target
  
  if (targetElement == null) {
    return undefined
  }
    
  return targetElement
})

const calcLeftAuto = () => {
  return parseInt(dimensions.value.activator.left - defaultOffset.value * 2 + '')
}

const calcLeft = (menuWidth: number) => {
  return convertToUnit(props.attach !== false
    ? computedLeft.value
    : calcXOverflow(computedLeft.value, menuWidth))
}

const styles = computed(() => ({
  maxHeight: calculatedMaxHeight.value,
  minWidth: calculatedMinWidth.value,
  maxWidth: calculatedMaxWidth.value,
  top: calculatedTop.value,
  left: calculatedLeft.value,
  transformOrigin: props.origin,
}))

const styleZIndex = computed(() => ({
  zIndex: props.zIndex
    ? props.zIndex
    : activeZIndex(content.value),
}))

const getRoundedBoundedClientRect = (el: Element) => {
  const rect = el.getBoundingClientRect()

  return {
    top: Math.round(rect.top),
    left: Math.round(rect.left),
    bottom: Math.round(rect.bottom),
    right: Math.round(rect.right),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  }
}

const measure = (el: HTMLElement) => {
  if (!el) return null

  const rect = getRoundedBoundedClientRect(el)

  if (props.attach !== false) {
    const style = window.getComputedStyle(el)

    rect.left = parseInt(style.marginLeft)
    rect.top = parseInt(style.marginTop)
  }

  return rect
}

const sneakPeek = (cb: () => void) => {
  requestAnimationFrame(() => {
    const el = content.value

    if (!el || el.style.display !== 'none') {
      cb()

      return
    }

    el.style.display = 'inline-block'
    cb()
    el.style.display = 'none'
  })
}

const updateDimensions = () => { 
  checkActivatorFixed()
  checkForPageYOffset()
  pageWidth.value = document.documentElement.clientWidth

  const newDimensions: any = {
    activator: { ...dimensions.value.activator },
    content: { ...dimensions.value.content },
  }

  if (props.absolute) {
    dimensions.value.activator = absolutePosition()
  }
  else {
    const activatorVars = activator.value
    
    if (!activatorVars) {
      return
    } 
    else { 
      newDimensions.activator = measure(activatorVars)
      newDimensions.activator.offsetLeft = activatorVars.offsetLeft
    

      if (props.attach !== false) {
        newDimensions.activator.offsetTop = activatorVars.offsetTop
      } 
      else {
        newDimensions.activator.offsetTop = 0
      }
    }
  }

  // Display and hide to get dimensions
  sneakPeek(() => {
    if (content.value) {
      if (content.value.offsetParent) {
        const offsetRect = getRoundedBoundedClientRect(content.value.offsetParent)

        relativeYOffset.value = window.pageYOffset + offsetRect.top
        newDimensions.activator.top -= relativeYOffset.value
        newDimensions.activator.left -= window.pageXOffset + offsetRect.left
      }

      newDimensions.content = measure(content.value)
    }

    dimensions.value = newDimensions
  })
}

const absolutePosition = () => {
  return {
    offsetTop: props.positionY || absoluteY.value,
    offsetLeft: props.positionX || absoluteX.value,
    scrollHeight: 0,
    top: props.positionY || absoluteY.value,
    bottom: props.positionY || absoluteY.value,
    left: props.positionX || absoluteX.value,
    right: props.positionX || absoluteX.value,
    height: 0,
    width: 0,
  }
}

const clickActivator = (e: MouseEvent) => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value

    absoluteX.value = e.clientX
    absoluteY.value = e.clientY

    emits('openMenu')
  }

} 

const open = () => {
  isOpen.value = true
}

const clickOutside = (e : PointerEvent) => {
  if (activator.value && activator.value.contains(e.target as Node)) {
    return
  }
  
  isOpen.value = false
  emits('clickOutside')
}

const clickClose = () => {
  isOpen.value = false
}

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)

  if (newValue) {
    updateDimensions()
  }
  else {
    emits('closeMenu')
  }
})

onMounted(() => {
  updateDimensions()
})
</script>

<template>
  <div>
    <div
      v-resize="updateDimensions"
      ref="activator"
      class="ui-cursor-pointer"
    >
      <slot
        name="activator"
        v-bind="({
          on: {
            click: clickActivator,
          },
          open,
          attrs: {
            class: 'activator',
          }
        })"
      />
    </div>
    <teleport
      :disabled="!teleportTarget"
      :to="teleportTarget"
    >    
      <transition
        :name="props.transitionName"
      >
        <div
          v-if="isOpen"
          v-click-outside="($event: PointerEvent) => { props.closeOnOutsideClick && clickOutside($event) }"
          class="ui-absolute m-menu--active ui-shadow-menu-shadow scroll-y ui-overflow-y-auto"
          :class="props.classBody"
          :style="{
            ...styles,
            ...styleZIndex,
          }"
          @click="() => { props.closeOnClick && clickClose() }"
          ref="content"
        >
          <slot />
        </div>
      </transition>
    </teleport>
  </div>
</template>