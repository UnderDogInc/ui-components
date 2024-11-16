<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'

import { ITabs } from './type'
import './MTabs.scss'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  tabs: {
    type: Array as PropType<Array<ITabs>>,
    required: true,
  },
  scrollable: Boolean,
})

const emit = defineEmits(['update:modelValue']) 

const updateModelValue = (item: ITabs): void => {
  emit('update:modelValue', item)
}

const classTabsText = (elementValue: string ): string => {
  if (elementValue === props.modelValue.value) {
    return 'ui-active ui-text-black-900 ui-bg-black-50 '
  }
  else {
    return 'ui-text-black-500 hover:ui-text-black-900'
  }
} 
</script>

<template>
  <div
    class="m-tabs__wrap ui-flex"
    :class="{
      'ui-flex-wrap': !props.scrollable,
      'ui-overflow-x-auto scroll-x': props.scrollable,
    }"
  >
    <div
      v-for="item in tabs"
      :key="item.value"
      class="m-tabs__item ui-text-p14-semibold ui-rounded-base ui-py-[10px] ui-font-semibold ui-m-[4px] ui-whitespace-nowrap ui-px-[12px] ui-cursor-pointer ui-w-[max-content] ui-transition ui-duration-300 ui-ease"
      :class="[
        classTabsText(item.value),
      ]"
      @click="updateModelValue(item)"
    >
      <slot
        name="item"
        v-bind="({
          item: item,
          on: {
            updateModelValue
          },
        })"
      >
        {{ item.title }}
      </slot>
    </div>
  </div>
</template>
