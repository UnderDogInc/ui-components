<script setup lang="ts">
import { defineProps, ref, defineEmits } from 'vue'
import type { PropType } from 'vue'

import { IItems } from './type' 
import { throttle } from '../../../assets/utils/utils'
import './MDragList.scss'

const props = defineProps({
  items: {
    type: Array as PropType<Array<IItems>>,
    reqired: true,
  },
  transition: {
    type: String,
    default: '0ms',
  },
})

const emits = defineEmits(['update:items']) 

const itemCurrentlyDragging = ref()
const items = ref(props.items)
const transitioning = ref(false) 

const transitionStart = () => {
  transitioning.value = true
}

const transitionEnd = () => {
  transitioning.value = false
}

const onDragOver = throttle((event: DragEvent, item: IItems) => {
  if (item.order === itemCurrentlyDragging.value.order || transitioning.value) {
    return
  }
  
  const oldPositionItem = items.value?.findIndex(el => el.order === itemCurrentlyDragging.value.order) || 0
  const newPositionItem = items.value?.findIndex(el => el.order === item.order) || 0

  items.value?.splice(oldPositionItem, 1)
  items.value?.splice(newPositionItem, 0, itemCurrentlyDragging.value) 
}, 50)

const onDragStart = (event: DragEvent, item: IItems) => {
  itemCurrentlyDragging.value = item
}

const onDragEnd = () => {
  emits('update:items', items.value)
}

</script>

<template>
  <div
    class="dradble"
  >
    <transition-group name="list">
      <div
        draggable="true"
        v-for="item in items"
        :key="item.order"
        @transitionstart.prevent="transitionStart"
        @transitionend="transitionEnd"
        @dragover.prevent.stop="onDragOver($event, item)"
        @dragstart.stop="onDragStart($event, item)"
        @dragend.stop="onDragEnd"
        @dragenter.prevent
      >
        <slot
          name="item"
          v-bind="item"
        >
          {{ item }}
        </slot>
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.list-move {
  transition: v-bind(transition);
}
</style>