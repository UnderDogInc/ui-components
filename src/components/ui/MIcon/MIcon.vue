<script setup lang="ts">
import { defineProps, computed, useAttrs } from 'vue'
import type { PropType } from 'vue'

import { Color, Brightness } from '../../../assets/utils/ColorClassConfig'
import { colorClass } from '../../../assets/utils/utils'


const props = defineProps({
  padding: {
    type: String,
    default: '10px',
  },
  bgColor: {
    type: String as PropType<Color>,
    default: 'red',
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
})

const attrs = useAttrs()

const colorClassBg = computed((): string => {
  return colorClass(props.bgColor, props.brightness, 'bgColor').class || ''
})

const colorStyleBg = computed(() => {
  return colorClass(props.bgColor, props.brightness, 'bgColor').style
})
</script>

<template>
  <div
    v-bind="attrs"
    class="ui-rounded-base ui-w-[max-content] ui-flex ui-justify-center ui-items-center ui-transition ui-ease"
    :class="[
      colorClassBg
    ]"
    :style="{
      padding: props.padding,
      ...colorStyleBg,
    }"
  >
    <slot />
  </div>
</template>
