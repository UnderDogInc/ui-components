<script setup lang="ts">
import { defineProps, defineEmits, PropType, ref} from 'vue'

import { Color, Brightness } from '../../../type'
import { colorClass, ICollor } from '../../../assets/utils/utils'
import './MRateRange.scss'

import StarIcon from '../../icon/StarIcon.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  widthIcon: {
    type: Number,
    default: 24,
  },
  backgroundColor: {
    type: String as PropType<Color>,
    default: 'black',
  },
  backgroundColorBrightness: {
    type: String as PropType<Brightness>,
    default: '50',
  },
  color: {
    type: String as PropType<Color>,
    default: 'primary',
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  colorHover: {
    type: String as PropType<Color>,
    default: 'primary',
  },
  brightnessHover: {
    type: String as PropType<Brightness>,
    default: '500',
  },
  length: {
    type: [Number, String],
    default: 5,
  },
  halfIncrements: Boolean,
  isReadonly: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const starHover = ref<number>(0)
const star = ref<HTMLElement[]>([])

const getColorCurrentStar = (index: number) => { 
  if ( props.halfIncrements && (starHover.value ^ 0) !== starHover.value && index === Math.ceil(starHover.value)) {
    const color = colorClass(props.colorHover, props.brightnessHover, 'fillColor')
    getColorHalfStar(index, color)    

    return 
  }

  if (starHover.value > 0 && index <= starHover.value) {
    return colorClass(props.colorHover, props.brightnessHover, 'fillColor')
  }


  if (props.halfIncrements && !starHover.value && (props.modelValue ^ 0) !== props.modelValue && index === Math.ceil(props.modelValue)) {
    const color = colorClass(props.color, props.brightness, 'fillColor')
    getColorHalfStar(index, color)

    return
  }

  if (!starHover.value && index <= props.modelValue ) {
    return colorClass(props.color, props.brightness, 'fillColor')
  }

}

const getBackgroundColor = colorClass(props.backgroundColor, props.backgroundColorBrightness, 'fillColor')

const getColorHalfStar = (index: number, fillColorHalf: ICollor) => {
  if (star.value[index - 1]) {   
    const pathHalf = star.value[index - 1].querySelector('.half > path') as HTMLElement
    
    while (pathHalf.classList.length > 0) {
      pathHalf.classList.remove(pathHalf.classList.item(0) || '')
    }

    fillColorHalf.class && pathHalf.classList.add(fillColorHalf.class)
    fillColorHalf.style && fillColorHalf.style.fill && (pathHalf.style.fill = fillColorHalf.style.fill)
  }
}

const isHalf = (index: number, value: number) => (value ^ 0) !== value && index === Math.ceil(value)


const newHoverStar = (event: MouseEvent, index: number) => {
  
  if (props.halfIncrements && event.offsetX < props.widthIcon / 2) {
    starHover.value = index - .5

    return
  }

  starHover.value = index
}

</script>

<template>
  <div
    class="m-rate-range__wrap ui-flex ui-space-x-[4px]"
  >
    <div
      v-for="index in props.length"
      :key="index"
      ref="star"
      class="m-rate-range__item"
      :class="{
        'ui-cursor-pointer': !props.isReadonly, 
      }"
      @click="!props.isReadonly && emits('update:modelValue', starHover)"
      @mousemove="!props.isReadonly && newHoverStar($event, +index)"
      @mouseleave="!props.isReadonly && (starHover = 0)"
    >
      <star-icon
        class="icon"
        :width="`${widthIcon}px`"
        :height="`${widthIcon}px`"
        :class="[
          ( getColorCurrentStar(+index)?.class ) || getBackgroundColor?.class,
          {
            'icon__half': props.halfIncrements && (isHalf(+index, props.modelValue) && !starHover) || (isHalf(+index, starHover) && Math.ceil(starHover) === +index)
          }
        ]"
        :style="( getColorCurrentStar(+index)?.style ) || getBackgroundColor?.style"
      />
    </div>
  </div>
</template>