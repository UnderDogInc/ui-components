<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import MLayoutMenu from '../MLayoutMenu/MLayoutMenu.vue'
import InfoIcon from '../../icon/InfoIcon.vue'
import './MQuote.scss'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    required: true,
  },
  maxWidth: {
    type: [Number, String],
    default: 'max-content',
  },
  transitionName: {
    type: String,
    default: 'm-quote-opasity',
  },
  top: Boolean,
  right: Boolean,
  bottom: Boolean,
  left: Boolean,
  disabled: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)
const quote = ref<HTMLElement>()
const wrap = ref<HTMLElement>()
const triangle = ref<HTMLElement>()

const positionTriangle = computed(() => {
  if (props.right) {
    return 'ui-rotate-90 ui-left-[-10px] ui-top-[50%] ui-translate-y-[-50%]'
  }

  if (props.left) {
    return 'ui-rotate-[-90deg] ui-right-[-10px] ui-top-[50%] ui-translate-y-[-50%]'
  }

  if (props.bottom) {
    return 'ui-rotate-[180deg] ui-top-[-8px]'
  }

  return 'ui-bottom-[-8px]'
}) 

const quoteOpen = () => {
  isOpen.value = true
}

const quoteClose = () => {
  emits('update:modelValue', false)
  isOpen.value = false
}

watch(quote, (newValue) => {
  if (newValue && wrap.value) {
    const {width: wrapWidth } = wrap.value.getBoundingClientRect()
    const centerWrap = wrapWidth / 2

    if (!props.left && !props.right) {
      if (triangle.value) {
        const {width: triangleWidth} = triangle.value.getBoundingClientRect()
        triangle.value.style.left = Math.abs(parseInt(newValue.style.left)) + (centerWrap - triangleWidth / 2) + 'px'
      }
    }
  }  
})

watch(isOpen, (newValue) => {
  emits('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

</script>

<template>
  <MLayoutMenu
    class="ui-relative ui-w-[max-content]"
    :is-open="isOpen"
    v-bind="$attrs"
  >
    <div
      ref="quote"
      class="m-quote ui-block ui-p-[12px] ui-rounded-base ui-bg-white-900 ui-shadow-quote-shadow ui-text-p12-medium"
    >
      <div 
        ref="triangle"
        class="triangle"
        :class="positionTriangle"
      />
      {{ props.text }}
    </div>
    <template
      #activator="item"
    >
      <div
        ref="wrap"
      >

        <slot
          name="activator"
          v-bind="({
            ...item,
            on: {
              mouseover: quoteOpen,
              mouseleave: quoteClose,
              touchstart: quoteOpen,
              touchend: quoteClose,
            },
            ative: isOpen && !props.disabled
          })"
        >
          <info-icon
            class="activator ui-transition"
            @mouseover="quoteOpen"
            @mouseleave="quoteClose"
            @touchstart="quoteOpen"
            @touchend="quoteClose"
            width="16px"
            height="16px"
            :fill="modelValue
              ? '#668BFB'
              : '#9A9FA5'"
          />
        </slot>
      </div>
    </template>
  </MLayoutMenu>
</template>