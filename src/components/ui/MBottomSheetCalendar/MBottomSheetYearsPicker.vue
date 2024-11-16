<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref, watch, nextTick, PropType } from 'vue'
import type { Ref } from 'vue'
import './MBottomSheetCalendar.scss'
import MBottomSheet from '../MBottomSheet/MBottomSheet.vue'

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

const emits = defineEmits(['newYear', 'update:isOpen'])

const isOpen = ref(props.isOpen)
const yersPicker: Ref<HTMLElement|null> = ref(null)

const firstYear = ref(props.modelValue - 100)
const lastYear = ref(props.modelValue + 100)

const yearsRange = computed(() => {
  return Array.from({length: lastYear.value - firstYear.value}, (_, i) => firstYear.value + i)
})

const newYear = (year: number) => {
  emits('newYear', year)
}

const scroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight

  if (scrollTop < 500) {
    firstYear.value = Math.max(1, firstYear.value - 100)
  }

  if (scrollHeight - scrollTop < 500) {
    lastYear.value = lastYear.value + 100
  }
}

const getBody = computed(() => {
  if (yersPicker.value) {
    return yersPicker.value.parentElement
  }

  return null
})

const scrollYearsListToCurrentYear = () => {
  if (yersPicker.value) {
    const body = yersPicker.value.parentElement
    const currentYearElement = document.getElementById('currentYearElement')
    
    if (body && currentYearElement) {
      const offsetTop = currentYearElement.offsetTop
      const yersPickerClientHeight = body.clientHeight
      const currentYearElementHeight = currentYearElement.clientHeight
      body.scroll({
        top: offsetTop - yersPickerClientHeight / 2 + currentYearElementHeight / 2,
      })
    }
  }
}


onMounted(() => {
  scrollYearsListToCurrentYear()
})

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue

  nextTick(() => {
    if (newValue) {
      getBody.value?.addEventListener('scroll', scroll)
      scrollYearsListToCurrentYear()
    }
    else {
      getBody.value?.removeEventListener('scroll', scroll)
    }
  })

})

watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)
})
</script>

<template>
  <m-bottom-sheet
    v-model="isOpen"
    :attach="attach"
    class="m-bottom-sheet-years"
  >
    <template #header>
      <div
        class="m-calendar__title ui-w-full ui-flex ui-items-center ui-justify-center ui-text-[20px] ui-leading-[160%] ui-text-black-900 ui-font-semibold"
      >
        Выберите год
      </div>
    </template>
    <div
      ref="yersPicker"
      class="m-calndar__years--warp ui-w-[100%] ui-h-[100%] ui-overflow-y-auto ui-scroll-y ui-scrollbar-hide"
      @scroll="scroll"
    >
      <div
        v-for="year in yearsRange"
        :key="year"
        class="m-calndar__years ui-flex ui-justify-center ui-py-[8px] ui-cursor-pointer"
        :class="{
          'ui-font-semibold ui-bg-background-color-900 ui-text-primary-900 ui-text-[16px] ui-transition-[font-size]': year === props.modelValue,
          'ui-text-base ui-text-black-500 hover:ui-bg-background-color-900 hover:ui-text-primary-900 ui-transition ui-duration-300 ui-ease': year !== props.modelValue,
        }"
        :id="year === props.modelValue
          ? 'currentYearElement'
          : ''
        "
        @click="newYear(year)"
      >
        {{year}}
      </div>
    </div>
  </m-bottom-sheet>
</template>