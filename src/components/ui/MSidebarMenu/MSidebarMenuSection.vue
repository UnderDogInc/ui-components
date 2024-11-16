<script setup lang="ts">
import { defineProps, ref, defineEmits, computed, watch } from 'vue'
import type { PropType } from 'vue'

import { TreeNode } from './type'

import MSidebarMenuItem from './MSidebarMenuItem.vue'

const props = defineProps({
  item: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
})

const emits = defineEmits(['newPath'])

const items = ref(props.item)

const isSection = computed(() => {
  return props.item.type === 'section'
})

const getItems = (item: TreeNode) => {
  if (isSection.value) {
    return item.items 
  }
  else {
    return [ item ]
  }
}

watch(() => props.item, (newValue) => {
  items.value = newValue
})
</script>

<template>
  <div
    class="tree__section ui-mb-[20px] ui-pb-[20px] "
  >
    <div
      class="tree__section-title ui-text-black-500 ui-text-[12px] ui-leading-[140%] ui-px-[12px] ui-mb-[8px]"
      v-if="isSection"
    >
      {{props.item.title}}
    </div>

    <div
      v-for="(_item, index) in getItems(items)"
      :key="index"
      class="ui-mb-[8px] last:ui-mb-[0px]"
    >
      <m-sidebar-menu-item
        :item="_item"
        @new-path="emits('newPath', $event)"
      />
    </div>
  </div>
</template>