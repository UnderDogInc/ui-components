<script setup lang="ts">
import { defineProps } from 'vue'
import propsData from './icon'

const props = defineProps(propsData)

</script>

<template>
  <svg
    :width="props.width"
    :height="props.width"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.4651 1.80005H3.41379V5.68421H3V6.94421H3.41379V7.50516H3V8.76516H3.41379V10.2H4.65517V8.76516H6.2069V7.50516H4.65517V6.94505H6.46544C7.86307 6.94505 9 5.79105 9 4.37263C9 2.95405 7.86305 1.80005 6.4651 1.80005ZM6.4656 5.68505H4.65517V5.68421V3.05988H6.4656C7.17865 3.05988 7.75878 3.64872 7.75878 4.37247C7.75878 5.09621 7.17865 5.68505 6.4656 5.68505Z"
      :fill="props.fill"
    />
  </svg>
</template>