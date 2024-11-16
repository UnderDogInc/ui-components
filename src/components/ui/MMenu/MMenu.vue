<script setup lang="ts">
import { useAttrs } from 'vue'
import CloseIcon from '../../icon/CloseIcon.vue'

import './MMenu.scss'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  transitionName: {
    type: String,
    default: 'slide-left',
  },
})

const emits = defineEmits(['update:modelValue'])

const closeMenu = (): void => {
  emits('update:modelValue', false)
}

const attrs = useAttrs()
</script>

<template>
  <teleport
    v-bind="$attrs"
    to="body"
  >
    <transition
      :name="props.transitionName"
    >
      <div
        v-bind="$attrs"
        v-scroll-lock="props.modelValue"
        v-if="props.modelValue"
        class="menu ui-bg-white-900 ui-h-full ui-w-full ui-fixed ui-top-0 ui-left-0"
        :class="attrs.class"
      >
        <slot
          name="header"
          v-bind="({
            on: {
              click: closeMenu
            }
          })"
        >
          <div
            class="menu__header ui-flex ui-justify-between ui-items-center ui-py-[24px] ui-pl-[14px] ui-pr-[26px] ui-border-b-[1px] ui-border-solid ui-border-black-50"
          >
            <button
              class="ui-p-[8px]"
              @click="closeMenu"
            >
              <close-icon
                width="32px"
                height="32px"
                fill="#9A9FA5"
              />
            </button>
            <slot
              name="header-logo"
            />
          </div>
        </slot>
        <div
          class="menu__body ui-px-[14px] ui-pt-[24px] ui-max-h-[calc(100vh_-_200px)] ui-overflow-auto scrollbar-hide"
        >
          <slot name="body">
          
          </slot> 
        </div>
        <slot name="footer" />
      </div>
    </transition>
  </teleport>
</template>
