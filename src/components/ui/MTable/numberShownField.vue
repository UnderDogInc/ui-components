<script setup lang="ts">
import { defineProps, PropType, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  items: {
    type: Array as PropType<Array<string|number>>,
    required: true,
  },
  text: {
    type: String,
    default: 'Отображать по:',
  },
})

const emits = defineEmits(['update:modelValue']) 

const updateNumber = (newValue: number) => {
  emits('update:modelValue', newValue)
}

</script>

<template>
  <div
    class="field__wrap ui-flex ui-flex-wrap -ui-m-[6px] ui-max-w-[calc(100%_+_6px)] ui-items-center"
  >
    <div class="field__text ui-font-semibold ui-text-base ui-text-black-900 ui-m-[6px]">
      {{ props.text }}
    </div>
    <div class="ui-flex ui-m-[6px]">
      <div
        v-for="item in props.items"
        :key="item"
        @click="updateNumber(+item)"
        class="fielt__items ui-font-semibold ui-w-[32px] ui-h-[32px] ui-rounded-base ui-transition ui-mr-[8px] last:ui-mr-[0px] ui-ease ui-duration-300 ui-flex ui-items-center ui-justify-center ui-text-[14px] ui-leading-[140%] ui-cursor-pointer hover:ui-border-[2px] hover:ui-border-black-50"
        :class="{
          'ui-border-black-50 ui-border-[2px] ui-text-black-900': +item === props.modelValue,
          'ui-text-black-500 hover:ui-text-black-900' : +item !== props.modelValue
        }"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
