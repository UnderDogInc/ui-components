<script setup lang="ts">
import { defineProps, ref, useSlots, watch } from 'vue'

import './MRadioButton.scss'

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  id: {
    type: String,
    required: true,
  },
  isDisabled: Boolean,
  isReadonly: Boolean,
})

const radioValue = ref<any>(props.modelValue)

const emits = defineEmits(['update:modelValue'])

const slots = useSlots()

const input = () => { 
  if (!props.isReadonly && !props.isDisabled) {
    emits('update:modelValue', props.value)
  }
}

watch(()=> props.modelValue, (newValue) => {
  if (newValue !== props.value) {
    radioValue.value = null
  }
})
</script>

<template>
  <div>
    <input  
      class="m-radio ui-absolute ui-opacity-0 ui-z-[-1]"
      type="radio"
      v-model="radioValue"
      :value="value"
      :disabled="props.isDisabled || props.isReadonly"
      :checked="JSON.stringify(radioValue) === JSON.stringify(props.value)"
      :id="id"
      @input="input"
    >
    <label
      :for="id"
      class="m-radio__lable ui-font-medium ui-text-base ui-flex ui-items-center ui-text-black-900"
      :class="{
        'before:ui-mr-[8px]': slots['default'],
        'm-radio__lable-readonly': props.isReadonly
      }"
    >
      <slot />
    </label>
  </div>
</template>