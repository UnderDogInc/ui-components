<script setup lang="ts">
import './HeaderBlock.scss'

defineProps({
  isMap: Boolean,
})

const emits = defineEmits(['update:isMap'])
</script>

<template>
  <div>
    <div
      class="block__header"
    >
      <div
        :class="{
          'active': isMap
        }"
        @click="emits('update:isMap', true)"
      >
        Карта
      </div>
      <div
        :class="{
          'active': !isMap
        }"
        @click="emits('update:isMap', false)"
      >
        Список
      </div>
    </div>
  </div>
</template>