<script setup lang="ts">
import { computed, onMounted, PropType, ref, Teleport, useSlots, watch } from 'vue'
import { activeZIndex } from '../../../assets/utils/utils'
import { Brightness, Color } from '../../../type'
import MTitle from '../MTitle/MTitle.vue'
import lodashDebounce from 'lodash/debounce'
import MIcon from '../MIcon/MIcon.vue'
import CloseIcon from '../../icon/CloseIcon.vue'

import './MBottomSheet.scss'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  titleBrightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  titleColor: {
    type: String as PropType<Color>,
    default: 'red',
  },
  transitionName: {
    type: String,
    default: 'bottom-sheet',
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: false,
  },
  attach: {
    type: [String, Boolean] as PropType<string | false>,
    default: 'body',
  },
})


const emits = defineEmits(['update:modelValue'])
const slots = useSlots()
const bottomSheet = ref<HTMLElement|null>(null)
const header = ref<HTMLElement|null>(null)
const footer = ref<HTMLElement|null>(null)
const body = ref<HTMLElement|null>(null)

const closeBorromSheet = () => {
  emits('update:modelValue', false)
}

const heightBody = ref('')

const updateHeightBody = () => {
  let offsetHeight = 148

  if (header.value) {
    offsetHeight += header.value.offsetHeight + 24
  }

  if (footer.value) {
    offsetHeight += footer.value.offsetHeight + 24
  }

  heightBody.value = window.innerHeight - offsetHeight + 'px'
}

const debounce = computed(() => {
  return lodashDebounce(updateHeightBody, 150)
})

onMounted(() => {
  updateHeightBody()
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    updateHeightBody()
  }
})
</script>

<template>
  <component
    :is="props.attach ? Teleport : 'div'"
    v-bind="$attrs"
    :to="props.attach || null"
  >
    <transition
      :name="props.transitionName"
      appear
    >
      <div
        v-if="props.modelValue"
        v-resize="debounce"
        v-scroll-lock="props.modelValue"
        v-bind="$attrs"
        class="bottom-sheet__wrap ui-fixed ui-w-full ui-h-full ui-top-0 ui-left-0"
        :style="{
          zIndex: activeZIndex(bottomSheet)
        }"
      >
        <div
          class="bottom-sheet bottom-sheet--active m-bottom-sheet--active ui-flex ui-flex-col ui-space-y-[24px] ui-absolute ui-w-full ui-bottom-0 ui-bg-white-900 ui-rounded-t-base ui-shadow-popup ui-px-[14px] ui-py-[24px]"
          ref="bottomSheet"
          :style="{
            zIndex: activeZIndex(bottomSheet)
          }"
        >
          <div
            class="bottom-sheet__header ui-flex ui-justify-between ui-items-center"
            ref="header"
          >
            <slot
              name="header"
              v-bind="({
                title: props.title,
                brightness: props.titleBrightness,
                color: props.titleColor,
                close: titleColor,
              })"
            >
              <m-title
                :brightness="props.titleBrightness"
                :color="props.titleColor"
              >
                {{ props.title }} 
              </m-title>
              <m-icon
                :bg-color="'black'"
                :brightness="'50'"
                padding="8px"
                class="ui-cursor-pointer"
                @click="closeBorromSheet"
              >
                <close-icon
                  width="24px"
                  height="24px"
                  fill="#9A9FA5"
                />
              </m-icon>
            </slot>
          </div>  
          <div
            class="bottom-sheet__body ui-min-h-[calc(30vh_-_80px)] ui-overflow-y-auto"
            :style="{
              maxHeight: heightBody,
            }"
            ref="body"
          >
            <slot
              v-bind="({
                refBody: body
              })"
            />
          </div>
          <div
            v-if="slots.footer"
            ref="footer"
            class="ui-bottom-sheet__footer"
          >
            <slot
              name="footer"
            />
          </div>
        </div>
        <div
          @click="closeOnOutsideClick && closeBorromSheet()"
          class="bottom-sheet__overlay ui-h-full ui-w-full ui-bg-background-color-900 ui-opacity-80 ui-backdrop-blur-[20px]"
          :style="{
            zIndex: activeZIndex(bottomSheet) - 1
          }"
        />
      </div>
    </transition>
  </component>
</template>