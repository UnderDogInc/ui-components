<script setup lang="ts">
import { defineProps, defineEmits, PropType, computed, ref } from 'vue'

import { colorClass } from '../../../assets/utils/utils'
import { Color, Brightness } from '../../../type'

export interface Item {
  value: string
  title: string
}
export type Type = 'tabs' | 'buttons'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Item>,
    required: true,
  },
  type: {
    type: String as PropType<Type>,
    default: 'buttons',
  },
  items: {
    type: Array as PropType<Array<Item>>,
    required: true,
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
  colorDefault: {
    type: String as PropType<Color>,
    default: 'black',
  },
  brightnessDefault: {
    type: String as PropType<Brightness>,
    default: '50',
  },
  canToggle: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const hoverItems = ref<Array<boolean>>(new Array(props.items.length).fill(false))

const isActive = (value: string) => props.modelValue?.value && props.modelValue.value === value

const typeClass = computed(() => {
  return props.type === 'buttons'
    ? 'ui-px-[10px] ui-py-[12px] ui-text-p14-semibold ui-rounded-base'
    : 'ui-px-[7px] ui-py-[4px] ui-text-p12-semibold ui-rounded-[6px]'
})

const color = (value: string) => {
  const border = isActive(value)
    ? colorClass(props.color, props.brightness, 'borderColor')
    : colorClass(props.colorDefault, props.brightnessDefault, 'borderColor')
  border.class += ' ui-border-solid ui-border-2 '
  
  if (props.type === 'tabs') {
    const backgroundClass = isActive(value)
      ? colorClass(props.color, props.brightness, 'bgColor')
      : colorClass(props.colorDefault, props.brightnessDefault, 'bgColor')
    
    border.class += ' ' + backgroundClass.class + (isActive(value)
      ? ' ui-text-white-900'
      : ' hover:ui-bg-white-900'
    )
    border.style && Object.assign(border.style, backgroundClass.style)
  }


  const hoverClass = colorClass(props.colorHover, props.brightnessHover, 'borderColor')

  if (hoverClass.class && !isActive(value)) {
    hoverClass.class = hoverClass.class
      .split(' ')
      .map(el => 'hover:' + el)
      .join(' ')
    
    border.class += ' ' + hoverClass.class
  }


  return border
}

const hoverStyle = (inHover: boolean, value: string) => {
  if (!inHover || isActive(value)) {
    return
  }

  const style = colorClass(props.colorHover, props.brightnessHover, 'borderColor')

  if (props.type === 'tabs') {
    style.style && (style.style.backgroundColor = '#FCFCFC')
  }

  return style
}

const select = (item: Item): void => {
  if (props.modelValue.value === item.value) {
    emits('update:modelValue', props.canToggle
      ? {
        title: '',
        value: '',
      }
      : item
    )
  }
  else {
    emits('update:modelValue', item)
  }
}

</script>

<template>
  <div
    class="m-tabs-button__wrap ui-flex ui-space-x-[12px]"
  > 
    <div
      v-for="(item, index) in items"
      :key="item.value"
      class="m-tabs-button__item ui-transition ui-duration-300 ui-font-semibold ui-ease ui-cursor-pointer"
      :class="[
        color(item.value)?.class,
        typeClass,
      ]"
      @mouseover="hoverItems[index] = true"
      @mouseleave="hoverItems[index] = false"
      @click="select(item)"
      :style="{
        ...color(item.value).style,
        ...hoverStyle(hoverItems[index], item.value)?.style,
      }"
    >
      {{ item.title }}
    </div>
  </div>
</template>
