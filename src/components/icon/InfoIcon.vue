<script setup lang="ts">
import { defineProps } from 'vue'
import propsData from './icon'

const props = defineProps(propsData)

</script>

<template>
  <svg
    v-bind="$attrs"
    :width="props.width"
    :height="props.height"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M14.6667 8C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8C1.33337 4.3181 4.31814 1.33334 8.00004 1.33334C11.6819 1.33334 14.6667 4.3181 14.6667 8ZM8.00004 7.33334C8.36823 7.33334 8.66671 7.63181 8.66671 8V11.3339C8.66671 11.7021 8.36823 12.0006 8.00004 12.0006C7.63185 12.0006 7.33337 11.7021 7.33337 11.3339V8C7.33337 7.63181 7.63185 7.33334 8.00004 7.33334ZM8.00004 6C8.36823 6 8.66671 5.70153 8.66671 5.33334C8.66671 4.96515 8.36823 4.66667 8.00004 4.66667C7.63185 4.66667 7.33337 4.96515 7.33337 5.33334C7.33337 5.70153 7.63185 6 8.00004 6Z"
      :fill="props.fill"
    />
  </svg>

</template>