<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentMonth: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(['newMounth'])

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
}

</script>

<template>
  <div class="ui-w-[100%] ui-h-[100%] ui-py-[24px] ui-grid ui-gap-[10px] ui-grid-cols-3">
    <div
      v-for="mounth in months"
      :key="mounth"
      class="ui-text-base ui-flex ui-items-center ui-justify-center ui-p-[10px] ui-rounded-sm ui-text-center ui-cursor-pointer"
      @click="newMounth(mounth)"
      :class="{
        'ui-text-primary-900 ui-font-semibold ui-bg-background-color-900': mounth === months[props.currentMonth],
        'ui-text-black-500 hover:ui-text-primary-900 hover:ui-bg-background-color-900 ui-transition ui-duration-300 ui-ease': mounth !== months[props.currentMonth],
      }"
    >
      {{mounth}}
    </div>
  </div>
</template>
