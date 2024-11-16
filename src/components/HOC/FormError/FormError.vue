<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  errorMessage: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <slot />
  <div
    v-if="props.errorMessage"
    class="ui-mt-[12px] ui-text-sm ui-text-red-900 ui-font-semibold"
    v-html="props.errorMessage"
  />
</template>