<script setup lang="ts">
import { defineProps, useSlots, defineEmits, PropType, computed } from 'vue'
import { checkHaveHTMLCode } from '../../../assets/utils/utils'

import CloseIcon from '@/components/icon/CloseIcon.vue'
import { Color, Brightness } from '../../../type'
import { colorClass } from '../../../assets/utils/utils'

const props = defineProps({
  title:{
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: '24px',
  },
  colorText: {
    type: String as PropType<Color>,
    default: 'black',
  },
  brightnessText: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  color: {
    type: String as PropType<Color>,
    default: 'black',
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '50',
  },
  canDeleted: Boolean,
})

const slots = useSlots()
const emits = defineEmits(['onDelete'])

const colorChips = computed(() => {
  return colorClass(props.color, props.brightness, 'bgColor')
})

const colorText = computed(() => {
  return colorClass(props.colorText, props.brightnessText, 'textColor')
})

</script>

<template>
  <div
    class="m-chip ui-py-[4px] ui-px-[8px] ui-rounded-sm ui-flex ui-w-[max-content]"
    :class="[
      colorChips.class
    ]"
    :style="{
      height: props.height,
      ...colorChips.style
    }"
  >
    <span
      v-if="slots['prepend-icon']"
      class="m-chip__prepend-icon ui-w-[16px] ui-h-[16px] ui-mr-[4px] ui-flex ui-cursor-pointer ui-items-center ui-justify-center"
    >
      <slot name="prepend-icon" />
    </span>

    <span
      v-if="!checkHaveHTMLCode(props.title)"
      class="m-chip__text ui-text-sm ui-font-semibold ui-flex ui-items-center"
      :class="[
        colorText.class
      ]"
      :style="{
        ...colorText.style
      }"
    >
      {{ props.title }}
    </span>
    <span
      v-else
      class="m-chip__text ui-text-sm ui-font-semibold ui-flex ui-items-center"
      :class="[
        colorText.class
      ]"
      :style="{
        ...colorText.style
      }"
      v-html="props.title"
    />

    <span
      v-if="props.canDeleted"
      class="m-chip__delete-icon ui-w-[16px] ui-h-[16px] ui-ml-[4px] ui-flex ui-cursor-pointer ui-items-center ui-justify-center ui-self-center"
      @click.prevent.stop="emits('onDelete', props.title)"
    >
      <slot name="deleted-icon">
        <close-icon
          width="16px"
          height="16px"
          fill="#1A1D1F"
        />
      </slot>
    </span>
  </div>
</template>