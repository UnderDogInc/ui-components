<script setup lang="ts">
import {defineProps, computed, useSlots, ComputedRef} from 'vue'

const props = defineProps({
  active: Boolean,
  isDisabled: Boolean,
  noClose: Boolean,
  multiple: Boolean,
})

const slots = useSlots()

const isActive = computed((): string => {
  return props.active
    ? 'ui-text-primary-900'
    : 'ui-text-black-500 hover:ui-text-black-900'
})

const isActiveMultiple = computed((): string => {
  return props.active
    ? 'ui-text-black-900 ui-bg-primary-100'
    : 'ui-text-black-500 hover:ui-text-black-900'
})
</script>


<template>
  <div
    class="m-list__item ui-text-base ui-font-semibold ui-mb-[4px] ui-p-3 hover:ui-bg-background-color-900 ui-cursor-pointer ui-rounded-base"
    :class="[
      { 'ui-text-black-200 text-black-200 ui-pointer-events-none ui-cursor-not-allowed' : props.isDisabled },
      props.multiple
        ? isActiveMultiple
        : isActive,
    ]"
  >
    <span
      v-if="slots['prepend-icon']"
      class="prepend-icon"
    >
      <slot name="prepend-icon"/>
    </span>
    <slot/>
    <span
      v-if="slots['append-icon']"
      class="append-icon"
    >
      <slot name="append-icon"/>
    </span>
  </div>
</template>
