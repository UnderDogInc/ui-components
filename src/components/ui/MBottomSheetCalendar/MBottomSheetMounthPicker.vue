<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, PropType } from 'vue'
import MBottomSheet from '../MBottomSheet/MBottomSheet.vue'
import './MBottomSheetCalendar.scss'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  attach: [Boolean, String] as PropType<string | false | undefined>,
})

const emits = defineEmits(['newMounth', 'update:isOpen'])
const isOpen = ref(props.isOpen)

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

const newMounth = (month: string) => {
  emits('newMounth', months.indexOf(month))
  isOpen.value = false
}


watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)
})

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})
</script>


<template>
  <m-bottom-sheet
    v-model="isOpen"
    :attach="attach"
    class="m-bottom-sheet-mounth"
  >
    <template #header>
      <div
        class="m-calndar__title ui-w-full ui-flex ui-items-center ui-justify-center ui-text-[20px] ui-leading-[160%] ui-text-black-900 ui-font-semibold"
      >
        Выберите месяц
      </div>
    </template>
    <div class="m-calndar__mounth--warp ui-w-[100%] ui-h-[100%] ui-py-[24px] ui-grid ui-gap-[10px] ui-grid-cols-3">
      <div
        v-for="mounth in months"
        :key="mounth"
        class="m-calndar__mounth ui-text-base ui-flex ui-items-center ui-justify-center ui-p-[10px] ui-rounded-sm ui-text-center ui-cursor-pointer"
        @click="newMounth(mounth)"
        :class="{
          'ui-text-primary-900 ui-font-semibold ui-bg-background-color-900': mounth === months[props.modelValue],
          'ui-text-black-500 hover:ui-text-primary-900 hover:ui-bg-background-color-900 ui-transition ui-duration-300 ui-ease': mounth !== months[props.modelValue],
        }"
      >
        {{mounth}}
      </div>
    </div>
  </m-bottom-sheet>
</template>

