<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'

const props = defineProps({
  currentYear: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(['newYear'])

const yersPicker: Ref<HTMLElement|null> = ref(null)

const firstYear = ref(props.currentYear - 100)
const lastYear = ref(props.currentYear + 100)

const yearsRange = computed(() => {
  return Array.from({length: lastYear.value - firstYear.value}, (_, i) => firstYear.value + i)
})

const newYear = (year: number) => {
  emits('newYear', year)
}

const scroll = (e: Event) => {
  const scrollTop = (e.target as HTMLElement).scrollTop
  const scrollHeight = (e.target as HTMLElement).scrollHeight

  if (scrollTop < 500) {
    firstYear.value = Math.max(1, firstYear.value - 100)
  }

  if (scrollHeight - scrollTop < 500) {
    lastYear.value = lastYear.value + 100
  }
}

onMounted(() => {
  const currentYear = document.getElementById('currentYearElement')

  if (yersPicker.value && currentYear) {
    const offsetTop = currentYear.offsetTop
    const yersPickerClientHeight = yersPicker.value.clientHeight
    const currentYearElementHeight = currentYear.clientHeight
    yersPicker.value.scroll({
      top: offsetTop - yersPickerClientHeight / 2 + currentYearElementHeight / 2,
    })
  }
})
</script>

<template>
  <div
    ref="yersPicker"
    class="ui-w-[100%] ui-h-[100%] ui-overflow-y-auto ui-scroll-y"
    @scroll="scroll"
  >
    <div
      v-for="year in yearsRange"
      :key="year"
      class="ui-flex ui-justify-center ui-py-[8px] ui-cursor-pointer"
      :class="{
        'ui-font-semibold ui-bg-background-color-900 ui-text-primary-900 ui-text-[16px]': year === props.currentYear,
        'ui-text-base ui-text-black-500 hover:ui-bg-background-color-900 hover:ui-text-primary-900 ui-transition ui-duration-300 ui-ease': year !== props.currentYear,
      }"
      :id="year === props.currentYear
        ? 'currentYearElement'
        : ''
      "
      @click="newYear(year)"
    >
      {{year}}
    </div>
  </div>
</template>