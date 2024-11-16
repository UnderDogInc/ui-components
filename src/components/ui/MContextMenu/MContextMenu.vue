<script setup lang="ts">
import { computed, watch } from 'vue'
import MLayoutMenu from '../MLayoutMenu'

import './MContextMenu.scss'

const props = defineProps({
  isOpen: Boolean,
  positionX: {
    type: Number,
    required: true,
  },
  positionY: {
    type: Number,
    required: true,
  },
  transitionName: {
    type: String,
    default: 'context-menu-transition',
  },
})

const emits = defineEmits(['update:isOpen'])

const _isOpen = computed({
  get() {
    return props.isOpen
  },
  set(value) {
    emits('update:isOpen', value)
  },
})

const closeMenu = (): void => {
  _isOpen.value = false
}

watch(_isOpen, (newValue) => {
  if (newValue) {
    window.addEventListener('resize', closeMenu)
    window.addEventListener('scroll', closeMenu)
  }
  else {
    window.removeEventListener('resize', closeMenu)
    window.removeEventListener('scroll', closeMenu)
  }
})
</script>

<template>
  <m-layout-menu
    v-model:is-open="_isOpen"
    :position-x="positionX" 
    :position-y="positionY"
    :transition-name="transitionName"
    :close-on-click="false"
  >
    <template #activator>
      <div />
    </template>
    <slot/>
  </m-layout-menu>
</template>