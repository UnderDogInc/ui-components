<script setup lang="ts">
import MButton from '@/components/ui/MButton/MButton.vue'

</script>

<template>
  <m-button
    block
    outline
    color="black"
    brightness="50"
    class="hover:ui-border-primary-500 ui-transition ui-ease-in-out"
  >
    <template #prepend-icon>
      <slot name="prepend-icon"/>
    </template>
    <slot/>
  </m-button>
</template>
