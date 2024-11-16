<script setup lang="ts">
import { computed, defineProps, PropType } from 'vue'

import ArrowUpIcon from '../../icon/ArrowUpIcon.vue'
import ArrowDownIcon from '../../icon/ArrowDownIcon.vue'
import { Brightness, Color } from '../../../assets/utils/ColorClassConfig'
import { colorClass } from '../../../assets/utils/utils'
import "./MBadge.scss"

export type Type = 'down' | 'up'
export type Style = 'pill' | 'rounded'
export type Size = 'default' | 'small'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  style: {
    type: String as PropType<Style>,
    default: 'rounded',
  },
  colorDot: {
    type: String as PropType<Color>,
    default: 'primary',
  },
  showZero: {
    type: Boolean,
  },
  counter:  {
    type: Number,
    default: null,
  },
  maxCounter: {
    type: Number,
    default: 9,
  },
  size: {
    type: String as PropType<Size>,
    default: 'default',
  },
  colorUp: {
    type: String as PropType<Color>,
    default: 'rgba(131, 191, 110, 0.1)',
  },
  brightnessUp: {
    type: String as PropType<Brightness>,
    default: '100',
  },
  colorDown: {
    type: String as PropType<Color>,
    default: 'rgba(255, 106, 85, 0.1)',
  },
  brightnessDown: {
    type: String as PropType<Brightness>,
    default: '100',
  },
  colorTextUp: {
    type: String as PropType<Color>,
    default: 'green',
  },
  brightnessTextUp: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  colorTextDown: {
    type: String as PropType<Color>,
    default: 'red',
  },
  brightnessTextDown: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  type: {
    type: String as PropType<Type>,
    default: null,
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
})

const classUpBadge = computed(() => {
  const bgColor = colorClass(props.colorUp, props.brightnessUp, 'bgColor').class
  const textColor = colorClass(props.colorTextUp, props.brightnessTextUp, 'textColor').class

  return `${bgColor} ${textColor}`
})

const classDownBadge = computed(() => {
  const bgColor = colorClass(props.colorDown, props.brightnessDown, 'bgColor').class
  const textColor = colorClass(props.colorTextDown, props.brightnessTextDown, 'textColor').class

  return `${bgColor} ${textColor}`
})

const styleUpBadge = computed(() => {
  const bgColor = colorClass(props.colorUp, props.brightnessUp, 'bgColor').style
  const textColor = colorClass(props.colorTextUp, props.brightnessTextUp, 'textColor').style

  return {
    ...bgColor,
    ...textColor,
  }
})

const styleDownBadge = computed(() => {
  const bgColor = colorClass(props.colorDown, props.brightnessDown, 'bgColor').style
  const textColor = colorClass(props.colorTextDown, props.brightnessTextDown, 'textColor').style

  return {
    ...bgColor,
    ...textColor,
  }
})

const classBadge = computed(() => {
  if (props.type === 'up') {
    return classUpBadge.value
  }

  return classDownBadge.value
})

const styleBadge = computed(() => {
  if (props.type === 'up') {
    return styleUpBadge.value
  }

  return styleDownBadge.value
})

const classUpFill = computed(() => {
  return colorClass(props.colorTextUp, props.brightnessTextUp, 'fillColor').class
})

const classDownFill = computed(() => {
  return colorClass(props.colorTextDown, props.brightnessTextDown, 'fillColor').class
})

const styleUpFill = computed(() => {
  return colorClass(props.colorTextUp, props.brightnessTextUp, 'fillColor').style
})

const styleDownFill = computed(() => {
  return colorClass(props.colorTextDown, props.brightnessTextDown, 'fillColor').style
})

const dotCounter = computed(() => {
  return props.counter >= props.maxCounter
    ? `${props.maxCounter}+`
    : props.counter
})

const classBadgeDot = computed(() => {
  return `badge-dot__${props.counter
    ? 'counter'
    : 'dot'}`
})

const classBadgeSmall = computed(() => {
  return `${props.size === 'small' && props.counter
    ? 'sm'
    : ''}`
})

const colorStyleBg = computed(() => {
  return colorClass(props.colorDot, props.brightness, 'bgColor').style
})

const colorClassBg = computed((): string => {
  return colorClass(props.colorDot, props.brightness, 'bgColor').class || ''
})

const showDot = computed(() => {
  return props.counter >= 1 ||  props.showZero
})

</script>

<template>
  <div class="badge">
    <div 
      v-if="style === 'pill'"
      class="badge-dot"
    >
      <div
        v-if="showDot"
        :class="[classBadgeDot, classBadgeSmall, colorClassBg]"
        :style="colorStyleBg"
      >
        <span
          v-if="counter"
          class="badge-dot__number"
        >
          {{ dotCounter }}
        </span>
      </div>
      <slot/>
    </div>
    <div
      v-else
      v-bind="$attrs"
      class="m-rate__wrap ui-flex ui-p-[4px] ui-items-center ui-rounded-[6px]"
      :class="classBadge"
      :style="styleBadge"
    >
      <slot name="icon">
        <arrow-up-icon
          :class="[classUpFill]"
          :style="styleUpFill"
          width="16px"
          height="16px"
          v-if="type === 'up'"
        />
        <arrow-down-icon
          :class="[classDownFill]"
          :style="styleDownFill"
          width="16px"
          height="16px"
          v-else-if="type === 'down'"
        />
      </slot>
      <div
        class="badge__text ui-text-p12-semibold ui-font-semibold"
      >
        {{ props.title }}
      </div>
    </div>
  </div>
</template>
