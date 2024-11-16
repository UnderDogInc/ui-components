<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue'
import type { typeAnimationName } from './type'

import './MLoading.scss'

const props = defineProps({
  animationName: {
    type: String as PropType<typeAnimationName>,
    default: 'circle',
  },
  color: {
    type: String as PropType<`#${string}`>,
    default: undefined,
  },
})

const loading = ref<HTMLElement|null>(null)

enum dataCountDiv {
  circle = 1,
  'dual-ring' = 0,
  'facebook' = 3,
  heart = 1,
  ring = 4,
  roller = 8,
  default = 12,
  ellipsis = 4,
  grid = 9,
  hourglass = 0,
  ripple = 2,
  spinner = 12,
}

const countDivFromAnimation = computed(() => {
  return dataCountDiv[props.animationName]
})

watch(() => props.color, (newValue) => {
  if (loading.value) {
    loading.value.style.setProperty('--loading-color', newValue || '#FCFCFC')
  }
})

onMounted(() => {
  if (loading.value) {
    loading.value.style.setProperty('--loading-color', props.color || '#FCFCFC')
  }
})
</script>

<template>
  <div>
    <div
      ref="loading"
      class="loading"
      :class="'lds-' + props.animationName"
    >
      <div
        v-for="item in countDivFromAnimation"
        :key="item"
      />
    </div>
  </div>
</template>
