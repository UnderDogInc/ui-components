<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { PropType } from 'vue'

import { Color, Brightness } from '../../../assets/utils/ColorClassConfig'

import ErrorIcon from '@/components/icon/ErrorIcon.vue'
import MIcon from '@/components/ui/MIcon/MIcon.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Произошла ошибка',
  },
  fillIcon: {
    type: String as PropType<`#${string}`>,
    default: "#FCFCFC",
  },
  badges: {
    type: Array as PropType<Array<string>>,
    default: null,
  },
  bgIcon: {
    type: String as PropType<Color>,
    default: 'red',
  },
  brightness: {
    type: String as PropType<Brightness>,
    default: '900',
  },
  items: {
    type: [Array, String],
    default: null,
  },
  listStyle: Boolean,
})

const itemIsArray = computed(() => Array.isArray(props.items))

</script>

<template>
  <div class="m-aler ui-flex ui-p-[12px] ui-rounded-base ui-bg-background-color-900 laptop:ui-p-[24px]">
    <m-icon
      :bg-color="props.bgIcon"
      :brightness="props.brightness"
      class="m-alert__icon ui-h-[min-content] ui-mr-[12px] laptop:ui-mr-[24px]"
    >
      <slot name="icon">
        <error-icon 
          width="20px"
          height="20px"
          :fill="props.fillIcon"
        />
      </slot>
    </m-icon>
    <div>
      <div class="m-alert__title ui-text-black-900 ui-font-bold mb-[12px] ui-text-[16px] ui-leading-[140%]">
        {{ props.title }}
      </div>
      <ul
        class="m-alert__item-wrap"
        v-if="itemIsArray"
      >
        <li
          v-for="(error, index) in props.items"
          :key="index"
          class="m-alert__item ui-text-black-900 ui-text-sm ui-mb-[4px] last:ui-mb-0"
          :class="{
            'after:ui-content-[\'\'] after:ui-w-[4px] after:ui-h-[4px] after:ui-bg-black-900 after:ui-absolute after:ui-rounded-[50%] after:ui-top-[50%] after:ui-translate-y-[-50%] after:ui-left-[0px] ui-relative ui-pl-[10px]': props.listStyle,
          }"
        >
          {{error}}
        </li>
      </ul>
      <div
        v-else
        class="ui-text-p14-medium ui-font-medium"
      >
        {{ props.items }}
      </div>
      <div
        v-if="props.badges && props.badges.length"
        class="ui-flex ui-mt-[12px] ui-space-x-[12px]"
      >
        <div
          v-for="(badge, index) in props.badges"
          :key="index"
          class="ui-text-p12-semibold ui-font-semibold ui-px-[8px] ui-py-[5px] ui-bg-white-900 ui-rounded-[6px]"
        >
          {{ badge }}
        </div>
      </div>
    </div>
  </div>
</template>