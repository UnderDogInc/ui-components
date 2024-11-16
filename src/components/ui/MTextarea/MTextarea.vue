<script setup lang="ts">
import { ref, useSlots, watch } from 'vue'
import './MTextarea.scss'
import FormError from '../../HOC/FormError/FormError.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: null,
  },
  cols: {
    type: String,
    default: '',
  },
  rows: {
    type: String,
    default: '',
  },
  lable: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  canResize: Boolean,
  isDisabled: Boolean,
  isReadonly: Boolean,
})

const slots = useSlots()
const emits = defineEmits(['update:modelValue'])
const value = ref(props.modelValue)

watch(value, (newValue) => {
  emits('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  value.value = newValue
})
</script>

<template>
  <form-error
    :error-message="props.errorMessage"
  >
    <label
      v-bind="$attrs"
      class="m-textarea-wrap ui-group"
    >
      <span
        v-if="slots['default'] || props.lable"
        class="m-textarea-lable"
      >
        <slot
          v-bind="({
            lable: props.lable
          })"
        >
          {{ props.lable }}
        </slot>
      </span>
      <textarea
        class="m-textarea scroll-y"
        :class="{
          'm-textarea-resize': props.canResize,
          'group-hover:ui-border-primary-500 focus:ui-border-primary-500': !props.isReadonly,
          'ui-cursor-default': props.isReadonly,
          '!ui-border-red-900': props.errorMessage,
        }"
        :cols="props.cols"
        :disabled="props.isDisabled"
        :readonly="props.isReadonly"
        :rows="props.rows"
        :placeholder="props.placeholder"
        v-model="value"
      />
    </label>
  </form-error>
</template>
