<script setup lang="ts">
import { defineProps } from 'vue'
import type { PropType } from 'vue'

import { Color, Brightness } from '../../../assets/utils/ColorClassConfig'
import { colorClass } from '../../../assets/utils/utils'

const props = defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
})

const classColor = colorClass(props.color, props.brightness, 'bgColor').class
const styleColor = colorClass(props.color, props.brightness, 'bgColor').style

</script>

<template>
  <div
    class="m-title__wrap ui-title ui-flex"
  >
    <span
      :class="[
        classColor,
      ]"
      :style="styleColor"
      class="m-title__block ui-inline-flex ui-w-[16px] ui-h-[32px] ui-rounded-sm ui-mr-[12px]"
    />
    <div class="m-title__text-wrap ui-flex ui-items-center">
      <span class="m-title__text ui-text-h2 ui-text-black-900 ui-font-semibold ui-tracking-[-1px]">
        <slot />
      </span>
    </div>
  </div>
</template>