<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, useSlots, computed } from 'vue'
import type { PropType, Ref } from 'vue'

import { Color, Brightness } from '../../../assets/utils/ColorClassConfig'
import { colorClass, activeZIndex } from '../../../assets/utils/utils'
import { TOffsetStyle, Position } from './type'
import './MPopup.scss'

import MTitle from '@/components/ui/MTitle/MTitle.vue'
import MIcon from '@/components/ui/MIcon/MIcon.vue'
import CloseIcon from '@/components/icon/CloseIcon.vue'


const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  colorTitle: {
    type: String as PropType<Color>,
    required: true,
  },
  brightnessTitle: {
    type: String as PropType<Brightness>,
    required: true,
  },
  bgColor: {
    type: String as PropType<Color>,
    default: 'white',
  },
  bgBrightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  maxWidth: {
    type: String,
    default: undefined,
  },
  maxHeight: {
    type: String,
    default: undefined,
  },
  minHeight: {
    type: String,
    default: undefined,
  },
  position: {
    type: Object as PropType<Position>,
    default: () => ({
      x: 'center',
      y: 'center',
    }),
  },
  target: {
    type: null as unknown as PropType<HTMLDivElement>,
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: false,
  },
  scrollable: Boolean,
})

const emits = defineEmits(['update:modelValue'])
const slots = useSlots()

const isOpen: Ref<boolean> = ref(props.modelValue)
const popup: Ref<HTMLDivElement|null> = ref(null)
const popupCard: Ref<HTMLDivElement|null> = ref(null)

const zIndex = computed(() => {
  return activeZIndex(popup.value)
})

const popupClassBgColor = computed((): string => {
  return colorClass(props.bgColor, props.bgBrightness, 'bgColor').class || ''
})

const popupStyleBgColor = computed(() => {
  return colorClass(props.bgColor, props.bgBrightness, 'bgColor').style
})

const offsetStyle = computed((): TOffsetStyle => {
  const style: TOffsetStyle = {
    maxHeight: props.maxHeight || '400px',
    minHeight: props.minHeight || '400px',
    maxWidth: props.maxWidth || '400px',
    minWidth: props.maxWidth || '400px',
    position: 'absolute',
  }
	
  return style
})

const heightPopupBody = () => {
  if (popupCard.value) {
    let popupContentHeight = popupCard.value.clientHeight - parseInt(getComputedStyle(popupCard.value).paddingBottom) - parseInt(getComputedStyle(popupCard.value).paddingTop)
    const popupChildrenNotBody = Array.from(popupCard.value.children).filter(el => !el.classList.value.includes('popup__body'))
    popupChildrenNotBody.forEach(el => {
      const style = getComputedStyle(el)
      popupContentHeight = popupContentHeight - parseInt(style.marginBottom) - parseInt(style.marginTop) - el.clientHeight

    })

    return popupContentHeight + 'px'
  }

  return undefined
}

const overlayVisible = ref(true)

const closePopup = (): void => {
  isOpen.value = false
}

watch(isOpen, (newValue) => {
  emits('update:modelValue', newValue)
})


watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})
</script>

<template>
  <teleport
    v-bind="$attrs"
    to="body"
  >
    <transition
      name="popup"
    >
      <div
        v-if="isOpen"
        v-scroll-lock="isOpen"
        v-bind="$attrs"
        ref="popup"
        :style="{
          zIndex: zIndex
        }"
        class="m-popup--active  m-popup__wrap ui-max-h-[calc(100% - 100px)] ui-fixed ui-top-0 ui-left-0 ui-bottom-0 ui-right-0"
      >
        <div
          class="m-popup--active m-popup ui-top-[50%] ui-left-[50%] ui-translate-y-[-50%] ui-translate-x-[-50%] ui-p-[24px] ui-rounded-large ui-z-[1] ui-shadow-popup"
          ref="popupCard"
          :class="[
            popupClassBgColor,
            {
              'ui-overflow-y-auto ui-scroll-y': !props.scrollable
            }
          ]"
          :style="{
            ...offsetStyle,
            ...popupStyleBgColor,
          }"
        >
          <div class="m-popup__header ui-mb-[24px] ui-flex ui-justify-between ui-items-center">
            <slot
              name="header"
              v-bind="({
                on: {
                  click: closePopup
                },
                data: {
                  title: props.title,
                  color: props.colorTitle,
                  brightness: props.brightnessTitle,
                }
              })"
            >
              <m-title
                :color="props.colorTitle"
                :brightness="props.brightnessTitle"
                :title="props.title"
                class="ui-mr-[24px]"
              >              
                {{ props.title}}
              </m-title>
              <m-icon
                padding="8px"
                bg-color="background-color"
                class="m-popup__close ui-cursor-pointer"
                @click="closePopup"
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
            class="m-popup__body"
            :class="{
              'ui-overflow-y-auto ui-scroll-y': props.scrollable
            }"
            :style="{
              height: props.scrollable 
                ? heightPopupBody()
                : ''
            }"
          >
            <slot />
          </div>
          <div
            v-if="slots['footer']"
            class="m-popup__footer ui-mt-[24px]"
          >
            <slot
              name="footer"
              v-bind="({
                on: {
                  click: closePopup
                },
              })"
            />
          </div>
        </div>
        <div
          @click="closeOnOutsideClick && closePopup()"
          class="m-popup__overlay ui-h-full ui-w-full"
          :class="{
            'ui-bg-background-color-900 ui-opacity-80 ui-backdrop-blur-[20px]': overlayVisible,
          }"
          :style="{
            zIndex: zIndex - 1
          }"
        />
      </div>
    </transition>
  </teleport>
</template>
