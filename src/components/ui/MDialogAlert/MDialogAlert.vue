<script setup lang="ts">
import { computed,  PropType, ref, watch } from 'vue'
import MIcon from '../MIcon/MIcon.vue'
import ErrorIcon from '../../icon/ErrorIcon.vue'
import MButton from '../MButton/MButton.vue'

import { Color, Brightness } from '../../../type'
import './MDialogAlert.scss'
import { activeZIndex, checkHaveHTMLCode } from '../../../assets/utils/utils'

const props = defineProps({
  isOpen: Boolean,
  transitionName: {
    type: String,
    default: 'dialog-open',
  },
  fillIcon: {
    type: String as PropType<`#${string}`>,
    default: "#9A9FA5",
  },
  bgIcon: {
    type: String as PropType<Color>,
    default: 'black',
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '50',
  },
  iconComponent: {
    type: Object,
    default: () => ErrorIcon,
  },
  title: {
    type: String,
    default: null,
  },
  text: {
    type: [Array, String],
    default: null,
  },
  cancelText: {
    type: String,
    default: 'Отменить',
  },
  acceptText: {
    type: String,
    default: null,
  },
  acceptButtonColor: {
    type: String as PropType<Color>,
    default: 'primary',
  },
  acceptButtonBrightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
})
const emits = defineEmits(['closeAlert', 'update:isOpen', 'clickAccept'])
const isOpen = ref(props.isOpen)
const dialogAlert = ref<HTMLElement|null>(null)

const cancelAlert = () => {
  isOpen.value = false
}

const textArray = computed(() => Array.isArray(props.text)
  ? props.text
  : [props.text]
)

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)
})

</script>

<template>
  <teleport
    v-bind="$attrs"
    to="body"
  >
    <transition
      :name="props.transitionName"
      appear
      @after-leave="emits('closeAlert')"
    >
      <div
        v-if="isOpen"
        v-bind="$attrs"
        v-scroll-lock="props.isOpen"
        class="m-dialog-alert-wrap ui-fixed ui-w-full ui-h-full ui-top-0 ui-left-0"
        :style="{
          zIndex: activeZIndex(dialogAlert)
        }"
      >
        <div
          ref="dialogAlert"
          class="m-dialog-alert m-dialog-alert--active ui-min-w-[300px] ui-bg-white-900 ui-rounded-base ui-shadow-popup ui-fixed ui-top-[50%] ui-left-[50%] ui-translate-x-[-50%] ui-translate-y-[-50%]"
        >
          <div
            class="m-dialog-alert__info max-768px:ui-p-[12px] ui-p-[24px] ui-border-b-[1px] ui-border-b-black-50 ui-flex"
          >
            <m-icon
              :bg-color="props.bgIcon"
              :brightness="props.brightness"
              class="m-alert__icon ui-h-[min-content] ui-mr-[12px] laptop:ui-mr-[24px]"
            >
              <slot name="icon">
                <component
                  :is="props.iconComponent"
                  width="20px"
                  height="20px"
                  :fill="props.fillIcon"
                />
              </slot>
            </m-icon>
            <div>
              <div
                class="m-dialog-alert__info-title ui-text-p16-semibold ui-font-semibold ui-mb-[8px] ui-text-black-900"
              >
                {{ props.title }}
              </div>
              <div
                class="m-dialog-alert__info-subtitle ui-text-p14-medium ui-font-medium ui-text-black-900"
              >
                <template
                  v-for="(item, index) in textArray"
                  :key="index"
                >
                  <div
                    v-if="!checkHaveHTMLCode(item as string)"
                    class="ui-mb-[6px] last:ui-mb-[0px]"
                  >
                    {{ item }}
                  </div>
                  <div
                    v-else
                    v-html="item"
                  />
                </template>
              </div>
            </div>
          </div>
          <div
            class="m-dialog-alert__actions ui-flex max-768px:ui-p-[12px] ui-p-[24px] ui-justify-end ui-space-x-[12px]"
          >
            <slot
              name="cancel-button"
              v-bind="({
                on: {
                  click: cancelAlert
                }
              })"
            >
              <m-button
                @click="cancelAlert"
                class="m-dialog-alert__actions-cancel !ui-px-[12px]"
                outline
                brightness="50"
                color="black"
              >
                {{ props.cancelText }}
              </m-button>
            </slot>
            <slot
              name="accept-button"
            >
              <m-button
                v-if="props.acceptText"
                @click="emits('clickAccept', $event)"
                class="m-dialog-alert__actions-accept !ui-px-[12px]"
                :brightness="props.acceptButtonBrightness"
                :color="props.acceptButtonColor"
              >
                {{ props.acceptText }}
              </m-button>
            </slot>
          </div>
        </div>
        <div
          v-if="isOpen"
          @click="cancelAlert"
          class="m-dialog-alert__overlay  -ui-z-[1] ui-absolute ui-w-full ui-h-full ui-top-0 ui-left-0 ui-bg-background-color-900 ui-opacity-80 ui-backdrop-blur-[16px]"
        />
      </div>
    </transition>
  </teleport>
</template>