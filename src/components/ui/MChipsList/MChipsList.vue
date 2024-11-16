<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'

import { IModelValue } from './type'

import MChip from '../MChip/MChip.vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<IModelValue>>,
    required: true,
  },
  title: {
    type: String,
    default: undefined,
  },
  keyToDelete: {
    type: String,
    default: 'title',
  },
})

const emits = defineEmits(['update:modelValue'])

const deleteChip = (item: any) => {
  const newModelValue = props.modelValue.filter((el: any) => el[props.keyToDelete] !== item[props.keyToDelete])

  emits('update:modelValue', newModelValue)
}
</script>

<template>
  <div
    v-if="props.title"
    class="m-chip__list-title ui-text-sm ui-mb-[13px] ui-font-semibold ui-text-black-900"
  >
    {{ props.title }}
  </div>
  <div
    class="m-chip__list ui-flex  ui-flex-wrap ui-p-[6px] ui-min-h-[48px] ui-rounded-base ui-border-[2px] ui-border-solid ui-border-black-50"
  >
    <m-chip
      v-for="(item, index) in props.modelValue"
      :key="`${item} - ${index}`"
      :title="item.title"
      can-deleted
      class="m-chip__list-item ui-m-[4px] last:ui-mr-[0px]"
      @on-delete="deleteChip(item)"
    />
  </div>
</template>
