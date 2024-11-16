<script setup lang="ts">
import { computed, defineProps, ref, defineEmits, watch } from 'vue'
import type { PropType, Ref } from 'vue'

import { TreeNode } from './type'
import './MSidebarMenu.scss'

import ChewronDownIcon from '@/components/icon/ChewronDownIcon.vue'

const props = defineProps({
  item: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
})

const emits = defineEmits(['newPath'])

const isOpen: Ref<boolean> = ref(props.item.active || false)

const classTextColor = computed((): string => {
  return props.item.current
    ? 'text-black-900 font-semibold'
    : 'text-black-500 group-hover:text-black-900 transition ease'
})

const clickItem = (item: TreeNode): void => {
  if (item.type === 'sub_menu') {
    isOpen.value = !isOpen.value
  }
	
  if (item.type === 'button') {
    emits('newPath', item.path)	
  }
}

const beforeEnter = (el: HTMLElement) => el.style.height = `0px`
const enter = (el: HTMLElement) => el.style.height = `${el.scrollHeight}px`
const afterEnter = (el: HTMLElement) => el.style.height = `auto`

const beforeLeave = (el: HTMLElement) => {
  el.style.height = `${el.scrollHeight}px`
  window.getComputedStyle(el, null).getPropertyValue('height')
}

const leave = (el: HTMLElement) => el.style.height = `0px`

watch(() => props.item, (newValue) => {
  isOpen.value = newValue.active || false
})
</script>

<template>
  <div>
    <div
      class="ui-flex ui-cursor-pointer ui-items-center ui-p-[12px] ui-group ui-rounded-base hover:ui-bg-black-50 ui-transition ui-ease"
      :class="{
        'ui-bg-black-50 ui-my-[6px]': props.item.current
      }"
      @click="clickItem(props.item)"
    >  
      <span v-if="props.item.icon_url">
        <div
          class="ui-w-[24px] ui-h-[24px] ui-mr-[8px]"
          :class="{
            'ui-bg-black-500 group-hover:ui-bg-black-900 ui-transition ui-ease': !props.item.current,
            'ui-bg-black-900': props.item.current,
          }"
          :style="{
            mask: `url(${props.item.icon_url}) no-repeat center ` ,
            '-webkit-mask': `url(${props.item.icon_url}) no-repeat center `,
          }"
        />
      </span>
      <span
        class="ui-flex-[1] ui-block ui-items-center ui-text-black-500 ui-text-p16-semibold ui-font-semibold group-hover:ui-text-black-900 ui-transition ui-ease"
        :class="[
          classTextColor,
          {
            'ui-ml-[32px]': !props.item.icon_url,
            'ui-text-black-900': props.item.current,
          }
        ]"
      >
        {{props.item.title}}
      </span>
      <span
        v-if="props.item.fast_action && props.item.fast_action.icon_url"
        class="fast_action"
        :class="{
          'ui-mr-[8px]': props.item.items
        }"
        @click.stop="emits('newPath', props.item.fast_action?.path)"
      >
        <div
          class="fast_action-icon ui-w-[24px] ui-h-[24px] ui-relative ui-cursor-pointer ui-overflow-hidden"
          :style="{
            mask: `url(${props.item.fast_action.icon_url}) no-repeat center ` ,
            '-webkit-mask': `url(${props.item.fast_action.icon_url}) no-repeat center `,
          }"
        />
      </span>
      <span v-if="props.item.items">
        <chewron-down-icon
          class="ui-transition-[transform] ui-duration-300 ui-ease group-hover:fill"
          :class="{
            'ui-rotate-[-180deg]': isOpen,
          }"
          width="24px"
          height="24px"
          fill="#9A9FA5"
        />
      </span>
    </div>

    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div
        class="ui-overflow-hidden ui-transition-[height] ui-duration-300 ui-ease"
        v-if="isOpen"
      >
        <m-sidebar-menu-item
          :item="item"
          v-for="(item, index) in props.item.items"
          :key="index"
          @new-path="emits('newPath', $event)"
        />
      </div>
    </transition>
  </div>
</template>
