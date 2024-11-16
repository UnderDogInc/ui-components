<script setup lang="ts">
import { defineProps, computed, useSlots } from 'vue'
import type { PropType } from 'vue'

import { Color, Brightness } from '../../../assets/utils/ColorClassConfig'
import { colorClass, ICollor } from '../../../assets/utils/utils'
import './MButton.scss'

import LoadingIcon from '@/components/icon/LoadingIcon/LoadingIcon.vue'

const props = defineProps({
  color: {
    type: String as PropType<Color>,
    default: 'primary',
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  colorText: {
    type: String as PropType<Color>,
    default: 'white',
  },
  brightnessText: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  isDisabled: Boolean,
  small: Boolean,
  outline: Boolean,
  isLoading: Boolean,
  block: Boolean,
})

const slots = useSlots()

const classColor = computed<string>(() => {
  const borderColor: ICollor = colorClass(props.color, props.brightness, 'borderColor')
  const bgColor:ICollor = colorClass(props.color, props.brightness, 'bgColor')
  const textColor:ICollor = colorClass(props.colorText, props.brightnessText, 'textColor')

  return props.outline
    ? `${borderColor.class} ui-border-solid ui-border-2 ${textColor.class}`
    : `${bgColor.class} ${textColor.class}`
})

const styleColor = computed(() => {
  const borderColor: ICollor = colorClass(props.color, props.brightness, 'borderColor')
  const bgColor:ICollor = colorClass(props.color, props.brightness, 'bgColor')
  const textColor:ICollor = colorClass(props.colorText, props.brightnessText, 'textColor')

  return {
    ...borderColor.style,
    ...textColor.style,
    ...bgColor.style,
  }
})

const classLoaderColor = computed<string>(() => {
  return colorClass(props.colorText, props.brightnessText, 'textColor').class || ''
})

const styleLoaderColor = computed(() => {
  return colorClass(props.colorText, props.brightnessText, 'textColor').style
})

const classIconSize = computed<string>(() => {
  return props.small
    ? `ui-w-[12px] ui-h-[12px]`
    : `ui-w-[16px] ui-h-[16px]`
})
</script>

<template>
  <button
    :disabled="props.isDisabled"
    class="m-button ui-button ui-font-semibold ui-outline-none"
    :class="[
      {
        'ui-button__disable': props.isDisabled,
        'outline': props.outline,
        'ui-button__sm': props.small,
        'ui-button__block': props.block,
      },
      classColor,
      colorClass(props.color, props.brightness, 'borderColor').class
    ]"
    :style="styleColor"
  >
    <loading-icon
      v-if="props.isLoading"
      :class="[
        classLoaderColor,
        classIconSize
      ]"
      :style="styleLoaderColor"
    />
    <template v-else>
      <span
        v-if="slots['prepend-icon']"
        class="prepend-icon ui-mr-[7px]"
        :class="[
          classIconSize,
        ]"
      >
        <slot name="prepend-icon"/>
      </span>
      <slot />
      <span 
        v-if="slots['append-icon']"
        class="append-icon ui-ml-[7px]"
        :class="[
          classIconSize,
        ]"
      >
        <slot name="append-icon"/>
      </span>
    </template>
  </button>
</template>
