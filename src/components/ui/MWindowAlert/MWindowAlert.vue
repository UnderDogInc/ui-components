<script setup lang="ts">
import { computed, onMounted, PropType } from 'vue'
import MIcon from '../MIcon/MIcon.vue'
import ErrorIcon from '../../icon/ErrorIcon.vue'
import ManyConfirmsIcon from '../../icon/ManyConfirmsIcon.vue'
import CloseIcon from '../../icon/CloseIcon.vue'

import type { TypeAlert, IOptionsAlerts } from './type'
import { Brightness, Color } from '../../../type'
import './MWindowAlert.scss'
import { checkHaveHTMLCode, activeZIndex } from '../../../assets/utils/utils'

const props = defineProps({
  isOpen: Boolean,
  type: {
    type: String as PropType<TypeAlert>,
    required: true,
  },
  colorIcon: {
    type: String as PropType<Color>,
    default: undefined,
  },
  brightnessIcon: {
    type: String as PropType<Brightness>,
    default: undefined,
  },
  fillIcon: {
    type: String as PropType<`#${string}`>,
    default: undefined,
  },
  borderColor: {
    type: String,
    default: undefined,
  },
  title:{
    type: String,
    default: undefined,
  },
  text: {
    type: String,
    required: true,
  },
  componentIcon: {
    type: Object,
    default: undefined,
  },
  transitionName: {
    type: String,
    default: 'right-alert',
  },
  timeActive: {
    type: String,
    default: '5000ms',
  },
  id: {
    type: [String, Number],
    default: '',
  },
  autoClosingAfterTime: Boolean,
})

const emits = defineEmits(['update:isOpen', 'close-alert'])


const dataAlert: {[key in TypeAlert]: IOptionsAlerts} = {
  error: {
    colorIcon: 'red',
    title: 'Ошибка!',
    text: '',
    brightnessIcon: '900',
    fillIcon: '#FCFCFC',
    borderColor: '#FF6A55',
    componentIcon: CloseIcon,
  },
  success: {
    colorIcon: 'green',
    title: 'Успешно!',
    text: '',
    brightnessIcon: '900',
    fillIcon: '#FCFCFC',
    borderColor: '#83BF6E',
    componentIcon: ManyConfirmsIcon,

  },
  warning: {
    colorIcon: 'black',
    title: 'Внимание!',
    text: '',
    brightnessIcon: '50',
    fillIcon: '#9A9FA5',
    borderColor: '#EDEDED',
    componentIcon: ErrorIcon,
  },
}

const iconData = computed(() => {
  const data = Object.assign({}, dataAlert[props.type]) as IOptionsAlerts

  for (const key in data) {
    if (props[key as keyof IOptionsAlerts]) {
      data[key as keyof IOptionsAlerts] = props[key as keyof IOptionsAlerts] as never
    }
  }

  return data
})

const beforeEnter = (el: HTMLElement) => {
  el.style.setProperty('--border-color', iconData.value.borderColor)
  el.style.setProperty('--transition-duration-load', props.timeActive)
}

const enter = (el: HTMLElement) => {
  const openAlert = Array.from(document.getElementsByClassName('alet__active')).filter(_el => _el !== el) as  HTMLElement[]

  if (openAlert.length) {
    const newAlertHeight = el.getBoundingClientRect().height

    openAlert.forEach((_el: HTMLElement) => {
      const currentBottom = parseInt(window.getComputedStyle(_el, null).getPropertyValue('bottom'))
      _el.style.bottom = currentBottom + newAlertHeight + 12 + 'px' 
    })
  }
  
}

const beforeLeave = (el: HTMLElement) => {
  const deletedAlertCssBottom = parseInt(window.getComputedStyle(el, null).getPropertyValue('bottom'))
  const openAlerts = Array.from(document.getElementsByClassName('alet__active'))
  const alertsOverDeletedAlert = openAlerts.filter(_el => parseInt(window.getComputedStyle(_el, null).getPropertyValue('bottom')) > deletedAlertCssBottom).reverse() as  HTMLElement[]  
  const alertsDownDeletedAlert = openAlerts.filter(_el => parseInt(window.getComputedStyle(_el, null).getPropertyValue('bottom')) < deletedAlertCssBottom).reverse() as  HTMLElement[]  
  let bottom = alertsDownDeletedAlert.reduce((maxHeight: number, _el: HTMLElement) => {
    const currentTop = parseInt(window.getComputedStyle(_el, null).getPropertyValue('bottom')) + _el.getBoundingClientRect().height

    if (maxHeight < currentTop + 12) {
      return currentTop + 12
    }

    return maxHeight 
  }, 40)
  alertsOverDeletedAlert.forEach((_el: HTMLElement) => {
    _el.style.bottom = bottom + 'px'
    _el.style.transitionDelay = '300ms'
    const currentHeight = _el.getBoundingClientRect().height
    bottom += currentHeight + 12
  })
}

const afterLeave = () => {
  const alertsOverDeletedAlert = Array.from(document.getElementsByClassName('alet__active')) as  HTMLElement[]  
  alertsOverDeletedAlert.forEach((el) => {
    el.style.transitionDelay = '0ms'
  })

  emits('close-alert')
}

const zIndex = computed(() => {
  return activeZIndex() < 10
    ? 10
    : activeZIndex()
})

onMounted(() => {
  if (props.autoClosingAfterTime) {
    setTimeout(() => {
      emits('update:isOpen', false)
    }, parseInt(props.timeActive) + 300)
  }
})
</script>

<template>
  <teleport
    v-bind="$attrs"
    to='body'
  >
    <transition
      :name="props.transitionName"
      appear
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div
        v-if="props.isOpen"
        v-bind="$attrs"
        class="m-window-alet alet__active ui-p-[14px] ui-inline-flex ui-bg-white-900 ui-items-center ui-rounded-base ui-fixed ui-bottom-[40px] ui-right-[40px] ui-transition-[bottom]"
        :style="{
          zIndex: zIndex
        }"
      > 
        <div
          class="m-window-alet__icon-wrap"
        >
          <m-icon
            padding="10px"
            :bg-color="iconData.colorIcon"
            :brightness="iconData.brightnessIcon"
          >
            <component
              :is="iconData.componentIcon"
              :fill="iconData.fillIcon"
              width="20px"
              height="20px"
            />
          </m-icon>
        </div>
        <div class="m-window-alet__icon ui-ml-[16px] ui-text-p14-medium ui-font-medium">
          <span class="ui-font-semibold">
            {{ iconData.title + ' ' }}
          </span>
          <span v-if="!checkHaveHTMLCode(iconData.text)">
            {{ ' ' + iconData.text }}
          </span>
          <span
            v-else
            v-html="iconData.text"
          />
        </div>
        <div
          class="m-window-alet__close-wrap ui-ml-[24px] ui-cursor-pointer"
          @click="emits('update:isOpen', false)"
        >
          <close-icon
            class="m-window-alet__close"
            width="24px"
            height="24px"
            fill="#9A9FA5"
          />
        </div>
      </div>
    </transition>
  </teleport>
</template>