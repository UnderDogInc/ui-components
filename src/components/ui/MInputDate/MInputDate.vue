<script setup lang="ts">
import { PropType, ref, watch } from 'vue'

import { ModelValue } from '../MCalendar/type'

import MInput from '../MInput/MInput.vue'
import CalendarIcon from '../../icon/CalendarIcon.vue'
import MCalendar from '../MCalendar/MCalendar.vue'
import MLayoutMenu from '../MLayoutMenu/MLayoutMenu.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ModelValue>,
    required: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  isOpen: Boolean,
  dateRange: Boolean,
  disableList: Boolean,
  timePicker: Boolean,
  error: Boolean,
  isReadonly: Boolean,
  isDisabled: Boolean,
})

const emits = defineEmits(['update:modelValue', 'update:isOpen'])

const value = ref(props.modelValue?.title || '')

const isOpen = ref(props.isOpen)
const currentDate = ref(props.modelValue)

watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)
})

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

watch(currentDate, (newValue) => {
  emits('update:modelValue', newValue)
  value.value = newValue.title
  isOpen.value = false
})

watch(() => props.modelValue, (newValue) => {
  currentDate.value = newValue
  value.value = newValue.title
  isOpen.value = false
})

watch(value, (newValue) => {
  if (!newValue) {
    currentDate.value = {
      title: '',
      value: '',
    }
  }
})
</script>

<template>
  <m-layout-menu
    min-width="auto"
    offset-y
    nudge-bottom="12"
    :close-on-click="false"
    :disabled="props.isDisabled || props.isReadonly"
    v-model:is-open="isOpen"
  >
    <template #activator="{on}">
      <m-input
        :error-message="props.errorMessage"
        :error="props.error"
        v-bind="$attrs"
        v-model="value"
        is-readonly-input
        :is-readonly="props.isReadonly"
        size="1"
        :clearable="props.clearable"
        :is-disabled="props.isDisabled"
        :append-icon-options="{
          bgColor: true,
          border: true,
        }"
        v-on="on"
      >
        <template #append-icon="{isFocus}">
          <calendar-icon
            class="group-hover:ui-stroke-black-900 ui-transition-[stroke] ui-duration-300 ui-ease"
            width="20px"
            height="20px"
            :fill="isFocus
              ? '#1A1D1F'
              : '#9A9FA5'"
          />
        </template>
        <template
          v-if="$slots['default']"
          #default
        >
          <slot />
        </template>
      </m-input>
    </template>

    <m-calendar
      v-model="currentDate"
      :date-picker="!props.dateRange"
      :time-picker="props.timePicker"
      can-close
      v-if="!props.disableList"
      @close-calendar="isOpen = false"
    />
  </m-layout-menu>
</template>
